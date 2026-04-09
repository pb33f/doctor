import {css} from 'lit';

export default css`
    :host {
        display: inline-block;
    }

    sl-button::part(base) {
        font-family: var(--font-stack), monospace;
        padding: 0;
        font-size: 1.5rem;
        text-transform: uppercase;
        letter-spacing: var(--label-spacing);
    }
`;
