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
    background: var(--card-background-color, rgba(35, 35, 35, 0.55));
    border: 1px dashed var(--hrcolor, #3d3d3d);
    border-radius: 0;
    padding: 0.3rem 0.6rem;
    font-family: var(--font-stack-bold, monospace);
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--font-color-sub1, #a7a7a7);
    transition: color 0.15s, border-color 0.15s;
  }
  button:hover {
    color: var(--primary-color, rgba(98, 196, 255, 1.0));
    border-color: var(--primary-color, rgba(98, 196, 255, 1.0));
  }
  select {
    cursor: pointer;
    background: var(--card-background-color, rgba(35, 35, 35, 0.55));
    border: 1px dashed var(--hrcolor, #3d3d3d);
    border-radius: 0;
    padding: 0.3rem 0.6rem;
    font-family: var(--font-stack-bold, monospace);
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--font-color-sub1, #a7a7a7);
  }
  select:hover {
    color: var(--primary-color, rgba(98, 196, 255, 1.0));
    border-color: var(--primary-color, rgba(98, 196, 255, 1.0));
  }
  option {
    background: var(--card-background-color, #1a1a1a);
    color: var(--font-color, #e8e9ed);
  }
`
