import {css} from "lit";

export default css`
    :host {
        display: block;
        margin-top: var(--global-padding-double);
    }

    h2 {
        border-bottom: 1px dashed var(--hrcolor);
        font-family: var(--font-stack), monospace;
        padding-bottom: var(--global-padding-double);
        margin-top: 80px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
    
    h3 {
        margin-bottom: 40px;
        font-family: var(--font-stack), monospace;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-size: 1.6rem;
        margin-top: 0;
    }

    .response {
        margin-bottom: 1.5rem;
        border: 1px dashed var(--secondary-color-dimmer);
        border-radius: 0;
        padding: 1rem;
    }
    
    .status-code {
        font-family: var(--font-stack-bold), monospace;
        margin-right: var(--global-padding-double);
        color: var(--primary-color);
    }

    .media-type-ref {
        margin-top: 40px;
        display: flex;
        align-items: center;
        gap: var(--global-padding-double);
        padding: var(--global-padding-double) 0;
    }

    .media-type-label {
        font-family: var(--font-stack-bold), monospace;
        color: var(--primary-color);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .array-type {
        font-family: var(--font-stack);
        color: var(--font-color-sub1);
    }

    /* ── Headers section ── */

    .headers-section {
        margin-top: 0.75rem;
        border-top: 1px dotted var(--hrcolor);
        padding-top: 0.5rem;
    }

    .headers-label {
        font-family: var(--font-stack-bold);
        color: var(--font-color-sub2);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-size: 0.8em;
        margin-bottom: 0.25rem;
    }

    .header-entry {
        padding: 0.35rem 0.75rem;
        border-bottom: 1px dotted var(--hrcolor);
    }

    .header-entry:last-child {
        border-bottom: none;
    }

    .header-name {
        font-family: var(--font-stack-bold);
        color: var(--font-color);
    }

    .header-type {
        color: var(--primary-color);
        margin-left: 0.5rem;
        font-family: var(--font-stack);
    }

    .header-desc {
        color: var(--font-color-sub1);
        margin-top: 0.2rem;
        font-size: 0.9em;
    }

    /* ── Common header grid ── */

    .common-header-grid {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 0.15rem 0.75rem;
        padding: 0.3rem 0.75rem;
        align-items: baseline;
    }

    .common-link-label {
        color: var(--font-color-sub2);
        font-family: var(--font-stack);
        font-size: 0.8em;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        grid-column: 1 / -1;
        margin-bottom: 0.15rem;
    }

    .header-anchor {
        color: var(--primary-color);
        text-decoration: none;
        font-family: var(--font-stack-bold);
        cursor: pointer;
    }

    .header-anchor:hover {
        color: var(--font-color);
        text-decoration: underline;
    }

    .common-header-desc {
        color: var(--font-color-sub1);
    }

    /* ── Inline examples ── */

    .inline-example {
        margin-top: var(--global-padding-double);
    }

    .inline-example-label {
        font-family: var(--font-stack), monospace;
        color: var(--font-color-sub2);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 0.25rem;
    }

    /* ── Response group headings ── */

    .response-group-heading {
        margin-top: 1.5rem;
    }

    /* ── Common errors ── */

    .common-error-link {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.25rem 0;
    }

    .error-anchor {
        color: var(--primary-color);
        text-decoration: none;
        font-family: var(--font-stack), monospace;
        cursor: pointer;
        font-size: 0.85em;
    }

    .error-anchor:hover {
        color: var(--font-color);
        text-decoration: underline;
    }

    .common-error-grid {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 0.15rem 0.75rem;
        margin-bottom: 0.5rem;
        align-items: baseline;
    }

    .common-error-code {
        font-family: var(--font-stack-bold);
        font-weight: 700;
        color: var(--primary-color);
    }

    .common-error-desc {
        color: var(--font-color-sub1);
    }

    pp-raw-viewer-btn {
        float: right;
    }
`
