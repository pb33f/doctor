import {css} from "lit";

export default css`
  :host {
    display: block;
  }
  sl-drawer {
    --size: 50vw;
  }
  sl-drawer::part(panel) {
    background: var(--terminal-background);
    border-left: 1px solid var(--hrcolor);
  }
  sl-drawer::part(header) {
    display: none;
  }
  sl-drawer::part(body) {
    padding: 0;
    display: flex;
    flex-direction: column;
    scrollbar-width: thin;
    scrollbar-color: var(--secondary-color-lowalpha) var(--terminal-background);
  }
  .drawer-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    background: var(--background-color);
    border-bottom: 1px solid var(--hrcolor);
    border-left: var(--global-padding-double) solid var(--secondary-color);
    position: sticky;
    top: 0;
    z-index: 1;
  }
  .drawer-title {
    margin: 0;
    font-family: var(--font-stack-bold), monospace;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--primary-color);
  }
  .rich-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  .header-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  .close-btn {
    color: var(--font-color-sub1);
    font-size: 1rem;
  }
  .code-container {
    position: relative;
    flex: 1;
  }
  .floating-copy {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    z-index: 1;
    --sl-color-primary-600: var(--primary-color);
  }
  pp-code-viewer {
    width: 100%;
  }
  .format-toggle {
    display: flex;
    gap: 0.5rem;
  }
  .format-toggle button {
    cursor: pointer;
    background: none;
    border: 1px dashed var(--hrcolor);
    color: var(--font-color-sub1);
    font-family: var(--font-stack), monospace;
    padding: 0.25rem 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    transition: color 0.15s, border-color 0.15s;
  }
  .format-toggle button.active {
    color: var(--primary-color);
    border-color: var(--primary-color);
  }
  .format-toggle button:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`
