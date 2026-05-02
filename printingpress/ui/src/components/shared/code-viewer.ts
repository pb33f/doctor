import {LitElement, html, nothing, PropertyValues} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import Prism from 'prismjs';
Prism.manual = true;
import 'prismjs/components/prism-json.js';
import 'prismjs/components/prism-yaml.js';
import 'prismjs/components/prism-markup.js';
import 'prismjs/components/prism-mermaid.js';
import codeViewerCss from './code-viewer.css.js';

if (Prism.languages.mermaid && !Prism.languages.mermaid['class-declaration']) {
    Prism.languages.insertBefore('mermaid', 'keyword', {
        'class-declaration': {
            pattern: /(^[ \t]*)class[ \t]+[\w$-]+/m,
            lookbehind: true,
            inside: {
                keyword: /^class/,
                'class-name': /[\w$-]+$/,
            },
        },
    });
    Prism.languages.insertBefore('mermaid', 'punctuation', {
        'class-member': {
            pattern: /^[ \t]*[+\-#~][\w$-]+\??(?:[ \t]+[\w$-]+)?/m,
            inside: {
                builtin: {
                    pattern: /(^[ \t]*[+\-#~])[\w$-]+\??/,
                    lookbehind: true,
                },
                property: {
                    pattern: /(\s)[\w$-]+$/,
                    lookbehind: true,
                },
                operator: /^[ \t]*[+\-#~]/,
            },
        },
        annotation: {
            pattern: /<<[^>\r\n]+>>/,
            alias: 'comment',
        },
    });
}

@customElement('pp-code-viewer')
export class PpCodeViewer extends LitElement {
    static styles = [codeViewerCss];

    @property() code = '';
    @property() language: 'json' | 'yaml' | 'xml' | 'mermaid' = 'json';
    @property({type: Boolean}) pretty = false;
    @property({attribute: 'line-numbers', type: Boolean}) lineNumbers = false;
    @property({attribute: 'highlight-lines'}) highlightLines = '';
    @property({attribute: 'start-line', type: Number}) startLine = 1;
    @property() location = '';
    @property({type: Boolean, reflect: true}) embedded = false;
    @property({attribute: 'reserve-location', type: Boolean}) reserveLocation = false;

    @state() private selectedLines: Set<number> = new Set();
    @state() private lastClickedLine: number | null = null;

    private _segmentCache: { code: string; language: string; segments: string[] } = {
        code: '', language: '', segments: []
    };
    private _highlightCache: { spec: string; parsed: Set<number> } = { spec: '', parsed: new Set() };

    get displayCode(): string {
        if (!this.code) return '';
        if (this.pretty && this.language === 'json') {
            try { return JSON.stringify(JSON.parse(this.code), null, 2); }
            catch { return this.code; }
        }
        return this.code;
    }

    private parseHighlightSpec(spec: string): Set<number> {
        const set = new Set<number>();
        if (!spec) return set;
        for (const part of spec.split(',')) {
            const trimmed = part.trim();
            const match = trimmed.match(/^(\d+)(?:-(\d+))?$/);
            if (!match) continue;
            const start = parseInt(match[1], 10);
            const end = match[2] ? parseInt(match[2], 10) : start;
            for (let i = Math.min(start, end); i <= Math.max(start, end); i++) {
                set.add(i);
            }
        }
        return set;
    }

    private highlightCode(): string {
        const code = this.displayCode;
        if (!code) return '';
        try {
            const prismLang = this.language === 'xml' ? 'markup' : this.language;
            return Prism.highlight(code, Prism.languages[prismLang], prismLang);
        } catch { return code; }
    }

    private splitHighlightedLines(html: string): string[] {
        const lines: string[] = [];
        let current = '';
        const openTags: string[] = [];
        let i = 0;
        while (i < html.length) {
            if (html[i] === '\n') {
                for (let t = openTags.length - 1; t >= 0; t--) current += '</span>';
                lines.push(current);
                current = openTags.join('');
                i++;
            } else if (html[i] === '<') {
                if (html.startsWith('</span>', i)) {
                    current += '</span>';
                    openTags.pop();
                    i += 7;
                } else {
                    const end = html.indexOf('>', i);
                    if (end === -1) { current += html[i]; i++; continue; }
                    const tag = html.slice(i, end + 1);
                    current += tag;
                    if (!tag.startsWith('</')) openTags.push(tag);
                    i = end + 1;
                }
            } else {
                current += html[i];
                i++;
            }
        }
        for (let t = openTags.length - 1; t >= 0; t--) current += '</span>';
        if (current) lines.push(current);
        return lines;
    }

    private getLineSegments(): string[] {
        const code = this.displayCode;
        if (code === this._segmentCache.code && this.language === this._segmentCache.language) {
            return this._segmentCache.segments;
        }
        const fullHtml = this.highlightCode();
        const segments = fullHtml ? this.splitHighlightedLines(fullHtml) : [];
        this._segmentCache = {code, language: this.language, segments};
        return segments;
    }

    private get parsedHighlights(): Set<number> {
        if (this._highlightCache.spec !== this.highlightLines) {
            this._highlightCache = { spec: this.highlightLines, parsed: this.parseHighlightSpec(this.highlightLines) };
        }
        return this._highlightCache.parsed;
    }

    private get effectiveHighlights(): Set<number> {
        const predefined = this.parsedHighlights;
        if (predefined.size > 0) return predefined;
        return this.selectedLines;
    }

    private get isLocked(): boolean {
        return this.parsedHighlights.size > 0;
    }

    scrollToLine(line: number) {
        const row = this.renderRoot.querySelector(`[data-line="${line}"]`) as HTMLElement | null;
        row?.scrollIntoView({block: 'center', behavior: 'auto'});
    }

    private handleLineClick(lineNum: number, e: MouseEvent) {
        if (this.isLocked) return;
        const newSet = new Set<number>();
        if (e.shiftKey && this.lastClickedLine !== null) {
            const start = Math.min(this.lastClickedLine, lineNum);
            const end = Math.max(this.lastClickedLine, lineNum);
            for (let i = start; i <= end; i++) newSet.add(i);
        } else {
            if (!(this.selectedLines.size === 1 && this.selectedLines.has(lineNum))) {
                newSet.add(lineNum);
            }
        }
        this.selectedLines = newSet;
        this.lastClickedLine = lineNum;
    }

    willUpdate(changed: PropertyValues) {
        if (changed.has('code') || changed.has('language')) {
            this.selectedLines = new Set();
            this.lastClickedLine = null;
        }
    }

    private renderLocation() {
        if (!this.location && !this.reserveLocation) {
            return nothing;
        }
        const empty = !this.location;
        return html`<div class="location ${empty ? 'empty' : ''}">${this.location || '\u00A0'}</div>`;
    }

    render() {
        if (!this.lineNumbers) {
            return html`
              ${this.renderLocation()}
              <pre class="language-${this.language}"><code>${unsafeHTML(this.highlightCode())}</code></pre>
            `;
        }

        const segments = this.getLineSegments();
        const offset = Math.max(this.startLine, 1);
        const lastLine = offset + segments.length - 1;
        const digits = lastLine > 0 ? Math.floor(Math.log10(lastLine)) + 1 : 1;
        const highlights = this.effectiveHighlights;
        const locked = this.isLocked;

        return html`
          ${this.renderLocation()}
          <div class="lined-code${locked ? ' locked' : ''}" style="--gutter-digits: ${digits}">
            <pre class="language-${this.language}"><code>${segments.map((lineHtml, i) => {
              const num = offset + i;
              const hl = highlights.has(num);
              return html`<span class="line${hl ? ' highlighted' : ''}" data-line=${num}
                ><span class="line-number"
                       @click=${(e: MouseEvent) => this.handleLineClick(num, e)}
                >${num}</span><span class="line-content">${unsafeHTML(lineHtml || ' ')}</span>
</span>`;
            })}</code></pre>
          </div>
        `;
    }
}
