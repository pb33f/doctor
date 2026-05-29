import {css} from 'lit';

export default css`
  :host {
    display: block;
  }

  sl-drawer::part(panel) {
    background: var(--background-color);
    border-top: var(--global-padding) solid var(--secondary-color);
  }

  sl-drawer::part(body) {
    padding: 0;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }

  .drawer-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--global-padding);
    padding: 0.55rem 1rem;
    border-bottom: 1px solid var(--hrcolor);
  }

  .drawer-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--global-padding);
    flex: 1;
    min-width: 0;
  }

  h3 {
    margin: 0;
    color: var(--primary-color);
    font-family: var(--font-stack-bold), monospace;
    text-transform: uppercase;
    letter-spacing: var(--title-spacing);
  }

  .rich-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    min-width: 0;
  }

  .component-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    min-width: 0;
  }

  .drawer-component-title {
    min-width: 0;
    color: var(--font-color);
    font-family: var(--font-stack-bold), monospace;
    font-size: 1.4rem;
    overflow-wrap: anywhere;
  }

  .problem-count {
    display: inline-grid;
    grid-template-columns: auto auto;
    align-items: center;
    gap: var(--global-padding);
    box-sizing: border-box;
    min-height: 2rem;
    padding: 0 var(--global-padding);
    border: 1px solid var(--hrcolor);
    color: var(--font-color-sub1);
    font-family: var(--font-stack), monospace;
    font-size: 0.9rem;
  }

  .problem-count .count-value {
    color: var(--primary-color);
    font-family: var(--font-stack-bold), monospace;
    font-variant-numeric: tabular-nums;
  }

  .problem-count .count-label {
    color: var(--font-color-sub1);
    text-transform: uppercase;
    letter-spacing: var(--label-spacing);
  }

  .split {
    flex: 1;
    min-height: 0;
    --divider-width: 2px;
    --divider-hit-area: 12px;
  }

  .split::part(divider) {
    background-color: var(--secondary-color);
  }

  .split sl-icon[slot="divider"] {
    position: absolute;
    left: 2px;
    border-radius: 0;
    background: var(--secondary-color);
    color: var(--background-color);
    padding: 0;
    width: 10px;
    height: 40px;
  }

  .split::part(divider):focus-visible {
    background-color: var(--primary-color);
  }

  .split:focus-within sl-icon[slot="divider"] {
    background-color: var(--primary-color);
    color: var(--background-color);
  }

  .problem-list,
  .slice-panel {
    height: 100%;
    min-height: 0;
  }

  .problem-list {
    overflow: auto;
  }

  .problem {
    display: grid;
    grid-template-columns: 3.25rem 1.5rem minmax(0, 1fr);
    gap: var(--global-padding);
    width: 100%;
    border: 0;
    background: transparent;
    color: var(--font-color);
    cursor: pointer;
    padding: 0.7rem;
    text-align: left;
    font-family: var(--font-stack), monospace;
  }

  .problem:hover,
  .problem.active {
    background: var(--primary-color-verylowalpha);
  }

  .problem:hover {
    background: color-mix(in srgb, var(--primary-color) 6%, transparent);
  }

  .problem.active {
    background: color-mix(in srgb, var(--primary-color) 14%, transparent);
  }

  .problem.active:hover {
    background: color-mix(in srgb, var(--primary-color) 16%, transparent);
  }

  .line {
    color: var(--font-color-sub1);
    font-variant-numeric: tabular-nums;
    text-align: right;
  }

  .severity-icon {
    width: 1.15rem;
    height: 1.15rem;
    margin-top: 0.05rem;
  }

  .problem.err .severity-icon {
    color: var(--error-color, #ff5572);
  }

  .problem.warn .severity-icon {
    color: var(--warn-color, #ffca5f);
  }

  .problem.info .severity-icon {
    color: var(--primary-color);
  }

  .message {
    color: var(--font-color);
    overflow-wrap: anywhere;
  }

  .message code {
    white-space: nowrap;
  }

  .slice-panel {
    overflow: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--secondary-color-lowalpha) var(--background-color);
  }

  pp-code-viewer {
    height: 100%;
  }

  .empty {
    display: grid;
    place-items: center;
    height: 100%;
    color: var(--font-color-sub1);
    font-family: var(--font-stack), monospace;
  }
`;
