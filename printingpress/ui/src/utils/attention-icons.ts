export const attentionInlineIcons: Record<string, string> = {
  'info-square': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"><rect x="2.25" y="2.25" width="11.5" height="11.5" rx="1.25"/><path d="M8 7.15v3.35"/><circle cx="8" cy="5.2" r=".55" fill="currentColor" stroke="none"/></svg>`,
  'exclamation-triangle': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2.1 13.8 12.9H2.2L8 2.1Z"/><path d="M8 6.1v3.45"/><circle cx="8" cy="11.35" r=".55" fill="currentColor" stroke="none"/></svg>`,
  'exclamation-square': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"><rect x="2.25" y="2.25" width="11.5" height="11.5" rx="1.25"/><path d="M8 5.35v4.1"/><circle cx="8" cy="11.35" r=".55" fill="currentColor" stroke="none"/></svg>`,
  'check-square': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"><rect x="2.25" y="2.25" width="11.5" height="11.5" rx="1.25"/><path d="M5.05 8.2 7.1 10.25 11.05 6.3"/></svg>`,
  'question-square': `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round"><rect x="2.25" y="2.25" width="11.5" height="11.5" rx="1.25"/><path d="M6.4 6.15A1.66 1.66 0 0 1 8 5.2c1.02 0 1.85.72 1.85 1.72 0 1.25-1.35 1.55-1.85 2.55"/><circle cx="8" cy="11.35" r=".55" fill="currentColor" stroke="none"/></svg>`,
};

export function resolveAttentionIconDataUri(name: string): string | undefined {
  const svg = attentionInlineIcons[name];
  if (!svg) return undefined;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
