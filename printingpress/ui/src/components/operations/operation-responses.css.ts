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
  .response {
    margin-bottom: 1.5rem;
    border: 1px dashed var(--hrcolor);
    border-radius: 0;
    padding: 1rem;
    background: rgba(35, 35, 35, 0.2);
  }
  h4 {
    margin: 0 0 0.5rem 0;
  }
  .status-code {
    font-family: var(--font-stack-bold);
    font-weight: 700;
    margin-right: 0.5em;
    color: var(--primary-color);
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
  .media-type-ref {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0;
  }
  .media-type-label {
    font-family: var(--font-stack-bold);
    color: var(--primary-color);
    text-transform: uppercase;
    letter-spacing: 0.03em;
    font-size: 0.85em;
  }
  .array-type {
    font-family: var(--font-stack);
    color: var(--font-color-sub1);
  }
  .schema-type {
    color: var(--font-color-sub2);
    font-family: var(--font-stack);
    font-size: 0.85em;
    margin-top: 0.25rem;
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
  .enum-values {
    color: var(--font-color-sub2);
    font-size: 0.85em;
    margin-top: 0.15rem;
  }
  .enum-value {
    color: var(--warn-400);
    font-family: var(--font-stack);
  }
  .nested {
    margin-left: 1rem;
    border-left: 1px dashed var(--secondary-color-dimmer);
  }
  .items-label {
    font-family: var(--font-stack);
    font-size: 0.8em;
    color: var(--font-color-sub2);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 0.3rem 0.75rem 0;
  }
  /* ── Headers section ── */
  .headers-section {
    margin-top: 0.75rem;
    border-top: 1px dotted var(--hrcolor);
    padding-top: 0.5rem;
  }
  .headers-label {
    font-family: var(--font-stack-bold);
    color: var(--font-color-sub2);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-size: 0.8em;
    margin-bottom: 0.25rem;
  }
  .header-entry {
    padding: 0.35rem 0.75rem;
    border-bottom: 1px dotted var(--hrcolor);
  }
  .header-entry:last-child {
    border-bottom: none;
  }
  .header-name {
    font-family: var(--font-stack-bold);
    color: var(--font-color);
  }
  .header-type {
    color: var(--primary-color);
    margin-left: 0.5rem;
    font-family: var(--font-stack);
  }
  .header-desc {
    color: var(--font-color-sub1);
    margin-top: 0.2rem;
    font-size: 0.9em;
  }
  /* ── Header constraints ── */
  .header-constraints {
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
  /* ── Common header grid ── */
  .common-header-grid {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.15rem 0.75rem;
    padding: 0.3rem 0.75rem;
    align-items: baseline;
  }
  .common-link-label {
    color: var(--font-color-sub2);
    font-family: var(--font-stack);
    font-size: 0.8em;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    grid-column: 1 / -1;
    margin-bottom: 0.15rem;
  }
  .header-anchor {
    color: var(--primary-color);
    text-decoration: none;
    font-family: var(--font-stack-bold);
    cursor: pointer;
  }
  .header-anchor:hover {
    color: var(--font-color);
    text-decoration: underline;
  }
  .common-header-desc {
    color: var(--font-color-sub1);
  }
  /* ── Inline examples ── */
  .inline-example {
    margin-top: 0.5rem;
  }
  .inline-example-label {
    font-family: var(--font-stack);
    color: var(--font-color-sub2);
    font-size: 0.8em;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.25rem;
  }
  /* ── Response group headings ── */
  .response-group-heading {
    margin-top: 1.5rem;
  }
  /* ── Common errors ── */
  .common-error-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0;
  }
  .error-anchor {
    color: var(--primary-color);
    text-decoration: none;
    font-family: var(--font-stack);
    cursor: pointer;
    font-size: 0.85em;
  }
  .error-anchor:hover {
    color: var(--font-color);
    text-decoration: underline;
  }
  .common-error-grid {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.15rem 0.75rem;
    margin-bottom: 0.5rem;
    align-items: baseline;
  }
  .common-error-code {
    font-family: var(--font-stack-bold);
    font-weight: 700;
    color: var(--primary-color);
  }
  .common-error-desc {
    color: var(--font-color-sub1);
  }
`
