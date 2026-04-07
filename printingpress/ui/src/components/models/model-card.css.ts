import {css} from "lit";

export default css`
  :host {
    display: block;
  }
  a {
    display: flex;
    flex-direction: column;
    min-width: 0;
    padding: 0.75rem 1rem;
    border: 1px dashed var(--hrcolor);
    border-radius: 0;
    color: var(--font-color);
    text-decoration: none;
    transition: border-color 0.15s;
    background: var(--card-background-color);
  }
  a:hover {
    border-color: var(--secondary-color);
    text-decoration: none;
  }
  strong {
    display: block;
    margin-bottom: 0.2rem;
    font-family: var(--font-stack-bold);
    color: var(--primary-color);
    min-width: 0;
    line-height: 1.25;
    overflow-wrap: anywhere;
    word-break: normal;
    hyphens: none;
  }
  p {
    color: var(--font-color-sub1);
    margin: 0;
    overflow-wrap: break-word;
  }
`
