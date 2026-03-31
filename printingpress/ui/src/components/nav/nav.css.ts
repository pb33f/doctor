import {css} from "lit";

export default css`
    :host {
        display: block;
        padding: var(--global-padding);
        font-family: var(--font-stack), monospace;
    }

    .nav-home {
        display: block;
        padding: var(--global-padding);
        font-family: var(--font-stack-bold), monospace;
        border-radius: 0;
        color: var(--primary-color);
        text-decoration: none;
        margin-bottom: var(--global-padding);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .nav-home:hover {
        background: var(--primary-color-verylowalpha);
        text-decoration: none;
    }

    .nav-section {
        margin-bottom: var(--global-padding);
    }

    h4 {
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: var(--secondary-color);
        font-family: var(--font-stack-bold), monospace;
        margin: 0 0 var(--global-padding) 0;
        padding-bottom: var(--global-padding);
        border-bottom: 1px dashed var(--secondary-color-dimmer);
    }

    .nav-models-section {
        margin-top: 0.75rem;
    }

    .nav-models-link {
        display: block;
        padding: var(--global-padding);
        color: var(--font-color-sub1);
        text-decoration: none;
    }

    .nav-models-link:hover {
        background: var(--primary-color-verylowalpha);
        color: var(--primary-color);
        text-decoration: none;
    }
`
