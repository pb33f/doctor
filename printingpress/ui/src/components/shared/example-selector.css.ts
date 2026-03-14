import {css} from "lit";

export default css`
  :host {
    display: inline-block;
    margin: 0.5rem 0;
  }
  .selector {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
  }
  button {
    cursor: pointer;
    background: var(--card-background-color);
    border: 1px dashed var(--hrcolor);
    border-radius: 0;
    padding: 0.3rem 0.6rem;
    font-family: var(--font-stack-bold);
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--font-color-sub1);
    transition: color 0.15s, border-color 0.15s;
  }
  button:hover {
    color: var(--primary-color);
    border-color: var(--primary-color);
  }
  sl-button::part(base) {
    border: 1px solid var(--primary-color);
    border-radius: 0;
    font-family: var(--font-stack);
    background-color: var(--background-color);
    color: var(--primary-color);
    min-height: 20px;
    max-height: 20px;
    min-width: 150px;
    max-width: 220px;
  }
  sl-button::part(label) {
    line-height: 17px;
    font-size: 0.7rem;
    overflow-x: hidden;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  sl-menu {
    border: 1px solid var(--primary-color);
    border-radius: 0;
  }
  sl-menu-item::part(base) {
    color: var(--primary-color);
    font-family: var(--font-stack);
    line-height: 17px;
    font-size: 0.7rem;
    --sl-color-neutral-100: var(--secondary-color-lowalpha);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`
