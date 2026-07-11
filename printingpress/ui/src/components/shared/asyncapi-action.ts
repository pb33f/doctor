import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import asyncapiActionCss from './asyncapi-action.css.js';

type AsyncAPIActionSize = 'small' | 'large';

function normalizeAction(action: string): string {
  return action.trim().toLowerCase();
}

function actionCode(action: string): string {
  switch (normalizeAction(action)) {
    case 'receive':
      return 'RCV';
    case 'send':
      return 'SND';
    default:
      return action.trim().toUpperCase();
  }
}

function actionIcon(action: string): string {
  switch (normalizeAction(action)) {
    case 'receive':
      return 'arrow-left';
    case 'send':
      return 'arrow-right';
    default:
      return 'arrow-right';
  }
}

function actionLabel(action: string): string {
  switch (normalizeAction(action)) {
    case 'receive':
      return 'Receive';
    case 'send':
      return 'Send';
    default:
      return action.trim();
  }
}

@customElement('pp-asyncapi-action')
export class PpAsyncAPIAction extends LitElement {
  static styles = asyncapiActionCss;

  @property({reflect: true}) action = '';
  @property({reflect: true}) size: AsyncAPIActionSize = 'small';

  render() {
    const normalized = normalizeAction(this.action);
    return html`
      <span class="action ${this.size} ${normalized}" aria-label=${actionLabel(this.action)}>
        <sl-icon name=${actionIcon(this.action)}></sl-icon>
        <span>${actionCode(this.action)}</span>
      </span>
    `;
  }
}
