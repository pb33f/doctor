import {css} from "lit";

export default css`
    :host {
        display: inline;
        position: relative;
        --ref-popover-default-width: 650px;
        --ref-popover-width: var(--ref-popover-default-width);
        --ref-popover-max-width: calc(100vw - var(--global-padding-double));
        --ref-popover-max-height: min(70vh, 600px);
    }

    .trigger {
        display: inline;
    }

    sl-popup {
        z-index: 10000;
    }

    sl-popup::part(popup) {
        z-index: 10000;
    }

    .pp-ref-popover-content {
        width: min(var(--ref-popover-width), var(--ref-popover-max-width));
        max-width: var(--ref-popover-max-width);
        max-height: var(--ref-popover-max-height);
        overflow-y: auto;
        overflow-x: hidden;
        overscroll-behavior: contain;
        background: var(--background-color);
        border: 1px dashed var(--secondary-color);
        padding: var(--global-padding);
        text-align: left;
    }

    .popover-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: var(--global-padding);
    }

    .popover-header pp-icon-title {
        --pp-icon-title-color: var(--font-color);
        --icon-title-icon-offset: 0.15em;
    }


    .popover-body {
        border-top: 1px dotted var(--hrcolor);
        padding-top: var(--global-padding);
    }

    .popover-example {
        border-top: 1px dotted var(--hrcolor);
        margin-top: var(--global-padding);
        padding-top: var(--global-padding);
    }

    .example-label {
        font-family: var(--font-stack), monospace;
        color: var(--font-color-sub1);
        text-transform: uppercase;
        letter-spacing: var(--label-spacing);
        margin-bottom: var(--global-padding);
        text-align: left;
    }
`
