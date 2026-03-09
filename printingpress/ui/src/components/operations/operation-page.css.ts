import {css} from "lit";

export default css`
  :host {
    display: block;
    margin-top: 2rem;
    border-top: 1px dashed var(--secondary-color-dimmer, rgba(248, 58, 255, 0.45));
    padding-top: 1.5rem;
  }
  h3 {
    margin-bottom: 0.5rem;
    color: var(--secondary-color, #f83aff);
    font-family: var(--font-stack-bold, monospace);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  pre {
    background: var(--terminal-background, #000);
    border: 1px solid var(--hrcolor, #3d3d3d);
    border-radius: 0;
    padding: 1rem;
    overflow-x: auto;
    color: var(--font-color, #e8e9ed);
  }
  code {
    background: none;
    padding: 0;
    border: none;
    color: var(--font-color, #e8e9ed);
  }
`
