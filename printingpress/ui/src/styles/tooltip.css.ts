import {css} from "lit";

export default css`
    /* Direct sl-tooltip styling (used by pp-raw-viewer-btn etc.) */
    sl-tooltip::part(base){
        font-family: var(--font-stack), monospace;
        font-size: 1rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    sl-tooltip::part(body){
        font-family: var(--font-stack), monospace;
        font-size: 0.9rem;
        background-color: var(--background-color);
        color: var(--font-color);
        border: 1px dashed var(--secondary-color);
        border-radius: 0;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    sl-tooltip::part(base__arrow){
        background-color: var(--secondary-color);
    }

    /* sl-copy-button forwarded tooltip parts (tooltip lives inside
       sl-copy-button's shadow DOM and is exposed via exportparts) */
    sl-copy-button::part(tooltip__base){
        font-family: var(--font-stack), monospace;
        font-size: 1rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    sl-copy-button::part(tooltip__body){
        font-family: var(--font-stack), monospace;
        font-size: 0.9rem;
        background-color: var(--background-color);
        color: var(--font-color);
        border: 1px dashed var(--secondary-color);
        border-radius: 0;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    sl-copy-button::part(tooltip__base__arrow){
        background-color: var(--secondary-color);
    }
`

