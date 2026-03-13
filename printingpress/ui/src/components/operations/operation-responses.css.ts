import {css} from "lit";

export default css`
  :host {
    display: block;
    margin-top: 1.5rem;
  }
  h3 {
    margin-bottom: 0.5rem;
    color: var(--secondary-color, #f83aff);
    font-family: var(--font-stack-bold, monospace);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .response {
    margin-bottom: 1.5rem;
    border: 1px dashed var(--hrcolor, #3d3d3d);
    border-radius: 0;
    padding: 1rem;
    background: rgba(35, 35, 35, 0.2);
  }
  h4 {
    margin: 0 0 0.5rem 0;
  }
  .status-code {
    font-family: var(--font-stack-bold, monospace);
    font-weight: 700;
    margin-right: 0.5em;
    color: var(--primary-color, rgba(98, 196, 255, 1.0));
  }
  .ref-link {
    color: var(--primary-color, rgba(98, 196, 255, 1.0));
    text-decoration: none;
  }
  .ref-link:hover {
    text-decoration: underline;
  }
  .media-type-ref {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0;
  }
  .media-type-label {
    font-family: var(--font-stack-bold, monospace);
    color: var(--primary-color, rgba(98, 196, 255, 1.0));
    text-transform: uppercase;
    letter-spacing: 0.03em;
    font-size: 0.85em;
  }
  .schema-type {
    color: var(--font-color-sub2, #6e6e6e);
    font-family: var(--font-stack, monospace);
    font-size: 0.85em;
    margin-top: 0.25rem;
  }
  .property {
    margin-bottom: 0;
    padding: 0.5rem 0.75rem;
    border-bottom: 1px dotted var(--secondary-color-dimmer, rgba(248, 58, 255, 0.45));
  }
  .prop-name {
    font-family: var(--font-stack-bold, monospace);
    color: var(--font-color, #e8e9ed);
  }
  .prop-type {
    color: var(--primary-color, rgba(98, 196, 255, 1.0));
    margin-left: 0.5rem;
    font-family: var(--font-stack, monospace);
  }
  .prop-desc {
    color: var(--font-color-sub1, #a7a7a7);
    margin-top: 0.2rem;
  }
  .required-badge {
    color: var(--error-color, #ff3c74);
    font-family: var(--font-stack-bold, monospace);
    margin-left: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .enum-values {
    color: var(--font-color-sub2, #6e6e6e);
    font-size: 0.85em;
    margin-top: 0.15rem;
  }
  .enum-value {
    color: var(--warn-400, #ff6a00);
    font-family: var(--font-stack, monospace);
  }
  .nested {
    margin-left: 1rem;
    border-left: 1px dashed var(--secondary-color-dimmer, rgba(248, 58, 255, 0.25));
  }
  .items-label {
    font-family: var(--font-stack, monospace);
    font-size: 0.8em;
    color: var(--font-color-sub2, #6e6e6e);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 0.3rem 0.75rem 0;
  }
`
