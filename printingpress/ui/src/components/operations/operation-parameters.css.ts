import {css} from "lit";

export default css`
  :host {
    display: block;
    margin-top: 1.5rem;
  }
  .parameter {
    display: grid;
    grid-template-columns: 200px 200px 1fr;
    gap: 0 1rem;
    padding: 15px 0.75rem;
    border-bottom: 1px dotted var(--secondary-color-dimmer);
  }
  .param-name-col {
    text-align: right;
    white-space: nowrap;
  }
  .param-type-col {
    white-space: nowrap;
  }
  .param-desc-col {
    color: var(--font-color-sub1);
    padding-top: 0.15rem;
  }
  .param-name {
    font-family: var(--font-stack-bold);
    color: var(--font-color);
  }
  .param-type {
    color: var(--secondary-color);
    font-family: var(--font-stack), monospace;
    font-size: 0.9rem;
    white-space: nowrap;
  }
  a.ref-link,
  a.ref-link:hover {
    color: var(--terminal-text);
    font-family: var(--font-stack);
  }
  a.ref-link {
    text-decoration: none;
  }
  a.ref-link:hover {
    text-decoration: underline;
  }
  a.ref-link.param-name {
    font-family: var(--font-stack-bold);
  }
  .param-in {
    color: var(--font-color-sub2);
    margin-left: 0.25rem;
    font-size: 0.8em;
    font-family: var(--font-stack);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .required-badge {
    color: var(--error-color);
    font-family: var(--font-stack-bold);
    margin-left: 0.25rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-size: 0.8em;
  }
  .deprecated-badge {
    color: var(--warn-400);
    font-family: var(--font-stack-bold);
    margin-left: 0.25rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-size: 0.8em;
  }
  .constraints {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.1rem 0.75rem;
    margin-top: 0.3rem;
    font-size: 0.85em;
    font-family: var(--font-stack);
  }
  .constraint-label {
    color: var(--font-color-sub2);
    text-align: right;
  }
  .constraint-value {
    color: var(--font-color-sub1);
  }
  .constraint-value code {
    color: var(--warn-400);
  }
  .enum-value {
    color: var(--warn-400);
    font-family: var(--font-stack);
  }
  .param-extras {
    grid-column: 1 / -1;
    padding-top: 0.25rem;
  }
`
