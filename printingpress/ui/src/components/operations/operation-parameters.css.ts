import {css} from "lit";

export default css`
  :host {
    display: block;
    margin-top: 1.5rem;
  }
  h3 {
    margin-bottom: 0.5rem;
    color: var(--secondary-color);
    font-family: var(--font-stack-bold);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .parameter {
    margin-bottom: 0;
    padding: 0.5rem 0.75rem;
    border-bottom: 1px dotted var(--secondary-color-dimmer);
  }
  .param-name {
    font-family: var(--font-stack-bold);
    color: var(--font-color);
  }
  .param-type {
    color: var(--primary-color);
    margin-left: 0.5rem;
    font-family: var(--font-stack);
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
    margin-left: 0.5rem;
    font-size: 0.8em;
    font-family: var(--font-stack);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .required-badge {
    color: var(--error-color);
    font-family: var(--font-stack-bold);
    margin-left: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .deprecated-badge {
    color: var(--warn-400);
    font-family: var(--font-stack-bold);
    margin-left: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .param-desc {
    color: var(--font-color-sub1);
    margin-top: 0.2rem;
  }
  .enum-values {
    color: var(--font-color-sub2);
    font-size: 0.85em;
    margin-top: 0.15rem;
  }
  .enum-value {
    color: var(--warn-400);
    font-family: var(--font-stack);
  }
`
