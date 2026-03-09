import {css} from "lit";

export default css`
  :host {
    display: block;
    margin: 0.75rem 0;
  }
  details {
    border: 1px dashed var(--hrcolor, #3d3d3d);
    border-radius: 0;
  }
  summary {
    cursor: pointer;
    padding: 0.5rem 0.75rem;
    font-family: var(--font-stack-bold, monospace);
    background: var(--card-background-color, rgba(35, 35, 35, 0.55));
    border-radius: 0;
    color: var(--font-color-sub1, #a7a7a7);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  summary:hover {
    color: var(--primary-color, rgba(98, 196, 255, 1.0));
  }
  pre {
    margin: 0;
    padding: 0.75rem;
    overflow-x: auto;
    background: var(--terminal-background, #000);
    color: var(--font-color, #e8e9ed);
  }
  code {
    background: none;
    padding: 0;
    border: none;
    color: inherit;
  }
`
