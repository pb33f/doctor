import {html, nothing, type TemplateResult} from 'lit';

export interface ViolationCounts {
  errors?: number;
  warns?: number;
  infos?: number;
}

export function violationTotal(counts?: ViolationCounts | null): number {
  if (!counts) return 0;
  return (counts.errors || 0) + (counts.warns || 0) + (counts.infos || 0);
}

export function pluralLabel(count: number, singular: string, plural = `${singular}s`): string {
  return count === 1 ? singular : plural;
}

export type ProblemSeverityClass = 'err' | 'warn' | 'info';

export function problemSeverityClass(severity?: number): ProblemSeverityClass {
  if (severity === 8) return 'err';
  if (severity === 4) return 'warn';
  return 'info';
}

export function problemSeverityIcon(severity?: number): string {
  if (severity === 8) return 'exclamation-square';
  if (severity === 4) return 'exclamation-triangle';
  return 'info-square';
}

export function problemSeverityLabel(severity?: number): string {
  if (severity === 8) return 'Error';
  if (severity === 4) return 'Warning';
  return 'Info';
}

export function worstSeverity(counts?: ViolationCounts | null): 'error' | 'warn' | 'info' | '' {
  if (!counts) return '';
  if ((counts.errors || 0) > 0) return 'error';
  if ((counts.warns || 0) > 0) return 'warn';
  if ((counts.infos || 0) > 0) return 'info';
  return '';
}

export function countForWorstSeverity(counts?: ViolationCounts | null): number {
  const severity = worstSeverity(counts);
  if (severity === 'error') return counts?.errors || 0;
  if (severity === 'warn') return counts?.warns || 0;
  if (severity === 'info') return counts?.infos || 0;
  return 0;
}

export function badgeLabel(counts?: ViolationCounts | null): string {
  const severity = worstSeverity(counts);
  const count = countForWorstSeverity(counts);
  if (!severity || count <= 0) return '';
  const noun = severity === 'warn' ? 'warning' : severity;
  return `${count} ${noun}${count === 1 ? '' : 's'}`;
}

export function renderViolationBadge(counts?: ViolationCounts | null): TemplateResult | typeof nothing {
  const severity = worstSeverity(counts);
  const count = countForWorstSeverity(counts);
  if (!severity || count <= 0) return nothing;
  const label = badgeLabel(counts);
  const display = count > 99 ? '99+' : String(count);
  return html`<sl-badge class=${`violation-badge ${severity}`}>
    ${display}<span class="sr-only"> ${label}</span>
  </sl-badge>`;
}

export function renderViolationBadges(counts?: ViolationCounts | null): TemplateResult | typeof nothing {
  if (!counts || violationTotal(counts) <= 0) return nothing;
  const badges: Array<{severity: 'error' | 'warn' | 'info'; count: number; noun: string}> = [
    {severity: 'error', count: counts.errors || 0, noun: 'error'},
    {severity: 'warn', count: counts.warns || 0, noun: 'warning'},
    {severity: 'info', count: counts.infos || 0, noun: 'info'},
  ];
  return html`
    <span class="violation-badges">
      ${badges.map(({severity, count, noun}) => {
        if (count <= 0) return nothing;
        const display = count > 99 ? '99+' : String(count);
        const label = `${count} ${noun}${count === 1 ? '' : 's'}`;
        return html`<sl-badge class=${`violation-badge ${severity}`}>
          ${display}<span class="sr-only"> ${label}</span>
        </sl-badge>`;
      })}
    </span>
  `;
}
