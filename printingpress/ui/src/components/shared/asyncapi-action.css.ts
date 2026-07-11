import {css} from 'lit';

export default css`
  :host {
    display: inline-flex;
    justify-self: end;
    align-items: center;
    color: var(--font-color);
    font-family: var(--font-stack), monospace;
    font-size: inherit;
    line-height: 1;
  }

  :host([action='receive']) {
    color: var(--primary-color);
  }

  :host([action='send']) {
    color: var(--secondary-color);
  }

  .action {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    line-height: 1;
  }

  .action.receive {
    color: var(--primary-color);
  }

  .action.send {
    color: var(--secondary-color);
  }

  sl-icon {
    width: 0.9em;
    height: 0.9em;
    font-size: 0.9em;
  }
`;
