import {describe, expect, it} from 'vitest';
import {resolveAttentionIconDataUri} from '../src/utils/attention-icons.js';

describe('attention icons', () => {
  it('resolves the full attention icon set to inline SVG data URIs', () => {
    for (const iconName of [
      'info-square',
      'exclamation-triangle',
      'exclamation-square',
      'check-square',
      'question-square',
    ]) {
      const uri = resolveAttentionIconDataUri(iconName);
      expect(uri).toBeTruthy();
      expect(uri).toContain('data:image/svg+xml,');
      expect(uri).toContain('%3Csvg');
    }
  });
});
