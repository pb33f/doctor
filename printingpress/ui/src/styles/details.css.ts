import {css} from "lit";

export default css`
  sl-details.pp-details {
    margin-top: 1.5rem;
  }
  sl-details.pp-details::part(base) {
    background: transparent;
    border: 1px dashed var(--secondary-color-dimmer);
    border-radius: 0;
  }
  sl-details.pp-details::part(header) {
    padding: 0.6rem 1rem;
  }
  sl-details.pp-details::part(summary-icon) {
    color: var(--secondary-color);
  }
  sl-details.pp-details::part(content) {
    padding: 0 1rem 1rem;
  }
  .pp-details-summary {
    font-family: var(--font-stack-bold);
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--secondary-color);
  }
`;
