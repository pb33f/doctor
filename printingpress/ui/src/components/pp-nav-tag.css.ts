import {css} from "lit";

export default css`
  :host {
    display: block;
  }
  details {
    margin-bottom: 0.15rem;
  }
  summary {
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    font-family: var(--font-stack-bold, monospace);
    border-radius: 0;
    list-style: none;
    color: var(--font-color-sub1, #a7a7a7);
    text-transform: lowercase;
  }
  summary:hover {
    background: var(--primary-color-verylowalpha, rgba(98, 196, 255, 0.1));
    color: var(--primary-color, rgba(98, 196, 255, 1.0));
  }
  summary::marker { display: none; }
  summary::-webkit-details-marker { display: none; }
  summary::before {
    content: '\\25B8 ';
    color: var(--secondary-color-dimmer, rgba(248, 58, 255, 0.45));
    margin-right: 2px;
  }
  details[open] > summary::before {
    content: '\\25BE ';
  }
  ul {
    list-style: none;
    margin: 0 0 0 0.5rem;
    padding: 0 0 0 0.5rem;
    border-left: 1px dashed var(--secondary-color-dimmer, rgba(248, 58, 255, 0.45));
  }
  li a {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.2rem 0.4rem;
    border-radius: 0;
    color: var(--font-color, #e8e9ed);
    text-decoration: none;
  }
  li a:hover {
    background: var(--primary-color-verylowalpha, rgba(98, 196, 255, 0.1));
    text-decoration: none;
  }
  li a.active {
    background: var(--secondary-color-very-lowalpha, rgba(248, 58, 255, 0.05));
    border-left: 2px solid var(--secondary-color, #f83aff);
    color: var(--primary-color, rgba(98, 196, 255, 1.0));
  }
  .path {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-family: var(--font-stack, monospace);
  }
  .children {
    margin-left: 0.25rem;
    padding-left: 0.25rem;
  }
  .deprecated {
    text-decoration: line-through;
    opacity: 0.5;
  }
`
