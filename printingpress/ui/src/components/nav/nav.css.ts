import {css} from "lit";

export default css`
  :host {
    display: block;
    padding: 0.75rem 0.5rem;
    font-family: var(--font-stack, BerkeleyMono-Regular, monospace);
  }

  .nav-home {
    display: block;
    padding: 0.5rem 0.75rem;
    font-family: var(--font-stack-bold, monospace);
    border-radius: 0;
    color: var(--primary-color, rgba(98, 196, 255, 1.0));
    text-decoration: none;
    margin-bottom: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .nav-home:hover {
    background: var(--primary-color-verylowalpha, rgba(98, 196, 255, 0.1));
    text-decoration: none;
  }

  .nav-section {
    margin-bottom: 0.75rem;
  }

  h4 {
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--secondary-color, #f83aff);
    font-family: var(--font-stack-bold, monospace);
    margin: 0 0 0.4rem 0.75rem;
    padding-bottom: 0.25rem;
    border-bottom: 1px dashed var(--secondary-color-dimmer, rgba(248, 58, 255, 0.45));
  }

  .nav-models-section {
    margin-top: 0.75rem;
  }

  .nav-models-link {
    display: block;
    padding: 0.3rem 0.75rem;
    color: var(--font-color-sub1, #a7a7a7);
    text-decoration: none;
  }
  .nav-models-link:hover {
    background: var(--primary-color-verylowalpha, rgba(98, 196, 255, 0.1));
    color: var(--primary-color, rgba(98, 196, 255, 1.0));
    text-decoration: none;
  }
`
