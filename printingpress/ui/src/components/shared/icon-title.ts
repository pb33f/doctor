import {LitElement, nothing} from 'lit';
import {html, unsafeStatic} from 'lit/static-html.js';
import {customElement, property} from 'lit/decorators.js';
import iconTitleCss from './icon-title.css.js';

@customElement('pp-icon-title')
export class PpIconTitle extends LitElement {
    static styles = [iconTitleCss];

    @property() icon = '';
    @property() heading = '';
    @property({type: Number}) level = 1;
    @property() size = 'huge';

    render() {
        if (!this.heading) return nothing;
        const tag = unsafeStatic(`h${Math.min(Math.max(this.level, 1), 6)}`);
        return html`
            <pb33f-model-icon icon=${this.icon} size=${this.size}></pb33f-model-icon>
            <${tag}>${this.heading}</${tag}>
        `;
    }
}
