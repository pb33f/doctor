import {css} from "lit";

export default css`
    sl-details.pp-details {
        display: block;
        min-height: 64px;
        margin-top: 40px;
        position: relative;
    }

    sl-details.pp-details:not(:defined) {
        display: block;
        min-height: 64px;
    }

    sl-details.pp-details:not(:defined) > :not([slot="summary"]) {
        display: none !important;
    }

    sl-details.pp-details:not(:defined) > [slot="summary"] {
        display: block;
    }

    sl-details.pp-details::part(base) {
        background: transparent;
        border: 1px dashed var(--secondary-color-dimmer);
        border-radius: 0;
    }

    sl-details.pp-details::part(header) {
        padding: var(--global-padding);
    }

    sl-details.pp-details::part(summary-icon) {
        color: var(--secondary-color);
    }

    sl-details.pp-details::part(content) {
        padding: var(--global-padding);
    }

    .pp-details-summary {
        text-transform: uppercase;
        letter-spacing: 0.05em;
        width: 100%;
    }
    
    .pp-details-summary h3 {
        margin: 0;
        border-bottom: none;
        padding: 0;
    }
`;
