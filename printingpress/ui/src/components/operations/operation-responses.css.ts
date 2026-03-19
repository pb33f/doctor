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
        margin-top: 40px;
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
        margin-bottom: var(--global-padding-double);
        border: 1px dashed var(--secondary-color-dimmer);
        border-radius: 0;
        padding: var(--global-padding-double);
    }

    .response:last-child {
        margin-bottom: 0;
    }


    .response > h3 {
        margin-bottom: 20px;
    }

    .pp-details-summary > h3 {
        margin-bottom: 0;
    }
    
    
    .status-code {
        font-family: var(--font-stack-bold), monospace;
    }

    .media-type-ref {
        margin-top: 20px;
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
        margin-top: var(--global-padding-double);
        padding-top: var(--global-padding-double);
    }

    .headers-label {
        font-family: var(--font-stack), monospace;
        font-weight: normal;
        color: var(--font-color-sub1);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: var(--global-padding-double);
        border-bottom: 1px dotted var(--hrcolor);
        padding-bottom: var(--global-padding);
        margin-top: var(--global-padding-double);
    }

    .header-entry {
        display: grid;
        grid-template-columns: 200px 200px 1fr;
        gap: 0 1rem;
        padding: var(--global-padding) var(--global-padding-double);
        border-top: 1px dotted var(--hrcolor);
    }

    .header-entry:first-child {
        border-bottom: none;
    }
    
    .header-entry-extensions {
        border-top: none;
    }
    
    .headers-values {
        border: 1px dashed var(--hrcolor);
    }
    
    .header-name-col {
        text-align: right;
        white-space: nowrap;
    }

    .header-name {
        font-family: var(--font-stack-bold), monospace;
        color: var(--font-color);
    }

    .header-type-col {
        white-space: nowrap;
    }

    .header-type {
        color: var(--primary-color);
        font-family: var(--font-stack), monospace;
    }

    .header-desc-col {
        color: var(--font-color-sub1);
    }

    /* ── Common header list ── */

    .common-link-label {
        color: var(--font-color-sub1);
        font-family: var(--font-stack), monospace;
        font-size: 0.8em;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        padding: var(--global-padding-double);
    }

    ul.common-header-list {
        list-style: none;
        padding-left: 20px;
        margin: 0;
    }

    ul.common-header-list > li {
        line-height: 1.8em;
    }

    ul.common-header-list > li::before {
        color: var(--primary-color);
        font-family: var(--font-stack-bold), monospace;
        margin-right: 10px;
        content: ">";
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

    /* ── Inline examples ── */

    .inline-example {
        margin-top: 20px;
    }

    .inline-example-label {
        font-family: var(--font-stack), monospace;
        color: var(--font-color-sub1);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: var(--global-padding-double);
    }

    /* ── Response group headings ── */

    .property-box {
        border: 1px dotted var(--hrcolor);
        padding: var(--global-padding);
    }
    
    .response-group-heading {
        margin-bottom: var(--global-padding-double);
    }

    .response-group-heading h4 {
        margin: 0;
        padding: 0;
        font-size: 1.2rem;
    }
    
    .response-extensions {
        margin-top: var(--global-padding-double);
        padding-top: var(--global-padding-double);
    }
    
    .media-type-extensions h4, 
    .response-extensions h4,
    .header-extensions h4 {
        font-weight: normal;
        margin-top: 0;
        border-bottom: 1px dotted var(--hrcolor);
        width: 100%;
        margin-bottom: var(--global-padding-double);
        padding-bottom: var(--global-padding);
        text-transform: uppercase;
        color: var(--font-color-sub1);
        letter-spacing: 0.05em;
        font-family: var(--font-stack), monospace;
    }

    .header-extensions {
        padding: 0;
    }



    /* ── Common errors ── */

    .common-error-link {
        display: flex;
        align-items: center;
        gap: var(--global-padding-double);
        padding: var(--global-padding);
    }

    .error-anchor {
        color: var(--primary-color);
        text-decoration: none;
        font-family: var(--font-stack), monospace;
        cursor: pointer;
    }

    .error-anchor:hover {
        color: var(--font-color);
        text-decoration: underline;
    }

    .common-error-grid {
        display: grid;
        grid-template-columns: auto 1fr;
        margin-bottom: var(--global-padding-double);
        border: 1px dotted var(--hrcolor);
    }

    .common-error-code {
        font-family: var(--font-stack), monospace;
        padding: var(--global-padding-double);
        border-bottom: 1px dotted var(--hrcolor);
    }

    .common-error-desc {
        padding: var(--global-padding-double) var(--global-padding-double) var(--global-padding-double) 40px;
        border-bottom: dotted 1px var(--hrcolor);
        color: var(--font-color-sub1);
    }
    
    .media-type-extensions {
        margin-top: var(--global-padding-double);
        padding-top: var(--global-padding-double);
    }

    .header-extensions {
        grid-column: 1 / -1;
        padding: var(--global-padding) var(--global-padding-double);
    }

    pp-raw-viewer-btn {
        float: right;
    }
`
