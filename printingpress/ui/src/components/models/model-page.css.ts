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
  pre {
    background: var(--terminal-background);
    border: 1px solid var(--hrcolor);
    border-radius: 0;
    padding: 1rem;
    overflow-x: auto;
    color: var(--font-color);
  }
  code {
    background: none;
    padding: 0;
    border: none;
    color: var(--font-color);
  }
  .property {
    margin-bottom: 0;
    padding: 0.5rem 0.75rem;
    border-bottom: 1px dotted var(--secondary-color-dimmer);
  }
  .prop-name {
    font-family: var(--font-stack-bold);
    color: var(--font-color);
  }
  .prop-type {
    color: var(--primary-color);
    margin-left: 0.5rem;
    font-family: var(--font-stack);
  }
  .prop-format {
    color: var(--font-color-sub2);
    margin-left: 0.25rem;
    font-family: var(--font-stack);
  }
  .prop-desc {
    color: var(--font-color-sub1);
    margin-top: 0.2rem;
  }
  .required-badge {
    color: var(--error-color);
    font-family: var(--font-stack-bold);
    margin-left: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
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
  .enum-values {
    color: var(--font-color-sub2);
    font-size: 0.85em;
    margin-top: 0.15rem;
  }
  .enum-value {
    color: var(--warn-400);
    font-family: var(--font-stack);
  }
  .traits {
    margin-bottom: 1rem;
  }
  .example-object {
    margin-bottom: 1rem;
    padding: 0.5rem 0.75rem;
    border-bottom: 1px dotted var(--secondary-color-dimmer);
  }
  .example-object:last-child {
    border-bottom: none;
  }
  .example-header {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
  }
  .example-summary {
    color: var(--font-color-sub1);
    font-family: var(--font-stack);
    font-size: 0.9em;
  }
  .example-external a {
    color: var(--terminal-text);
    text-decoration: none;
    font-family: var(--font-stack);
  }
  .example-external a:hover {
    text-decoration: underline;
  }
  a.ref-type-link,
  a.ref-type-link:visited,
  a.ref-type-link:active {
    color: var(--terminal-text);
    text-decoration: none;
    font-family: var(--font-stack);
  }
  a.ref-type-link:hover {
    text-decoration: underline;
  }
`
