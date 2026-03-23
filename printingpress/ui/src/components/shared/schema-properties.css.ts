import {css} from "lit";
import dropdownCss from '../../styles/dropdown.css.js';

export default [dropdownCss, css`
    :host {
        display: block;
        border: 1px dotted var(--hrcolor);
    }

    .property {
        display: grid;
        grid-template-columns: 200px 200px 1fr;
        gap: 0 1rem;
        padding: 15px var(--global-padding);
        border-bottom: 1px dotted var(--hrcolor);
    }

    .prop-name-col {
        text-align: right;
        white-space: nowrap;
    }

    .prop-type-col {
        white-space: nowrap;
    }

    .prop-desc-col {
    }

    .prop-name {
        font-family: var(--font-stack-bold), monospace;
        color: var(--font-color);
    }

    .prop-type {
        color: var(--primary-color);
        font-family: var(--font-stack), monospace;
        white-space: nowrap;
    }

    .prop-type-link {
        border: 1px dotted var(--background-color);
    }

    .required-badge {
        color: var(--error-color);
        border: 1px solid var(--error-color-dimmed);
        background-color: var(--error-color-verylowalpha);
        padding: 0 var(--global-padding);
        font-family: var(--font-stack-bold), monospace;
        margin-left: var(--global-padding);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    a.ref-type-link,
    a.ref-type-link:visited,
    a.ref-type-link:active {
        color: var(--terminal-text);
        text-decoration: none;
        font-family: var(--font-stack);
    }

    a.ref-type-link:hover {
        text-decoration: underline;
    }

    :host([compact]) .property {
        grid-template-columns: 1fr 1fr;
        padding: 8px 0.5rem;
    }

    :host([compact]) .prop-desc-col {
        display: none;
    }

    .property.scalar {
        grid-template-columns: auto 1fr;
    }

    :host([compact]) .property.scalar {
        grid-template-columns: 1fr;
    }

    :host([compact]) .property.scalar .prop-type-col {
        white-space: normal;
    }

    :host([compact]) .property.scalar .prop-desc-col {
        display: block;
    }

    .property.scalar .constraints {
        grid-template-columns: auto auto;
        justify-content: start;
    }

    .property.scalar .constraint-label {
        text-align: left;
    }

    .composition-refs {
        padding: 15px var(--global-padding);
        border-bottom: 1px dotted var(--hrcolor);
    }

    .composition-label {
        display: block;
        color: var(--font-color-dimmed);
        font-size: 0.85em;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 6px;
    }

    .composition-ref-entry {
        display: flex;
        align-items: baseline;
        gap: 1rem;
        padding: 4px 0;
    }

    .composition-ref-desc {
        color: var(--font-color-dimmed);
        font-size: 0.9em;
    }

    .composition-separator {
        color: var(--primary-color);
        font-weight: bold;
        margin: 0 0.25em;
    }

    :host([compact]) .composition-refs {
        padding: 8px 0.5rem;
    }

    :host([compact]) .composition-ref-desc {
        display: none;
    }

    :host([compact]) .composition-label {
        display: none;
    }

    .oneof-container {
        border-bottom: 1px dotted var(--hrcolor);
    }

    .oneof-selector {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 15px var(--global-padding);
    }

    .oneof-selector .composition-label {
        display: inline;
        margin-bottom: 0;
    }

    .oneof-selector sl-dropdown {
        margin-top: 0;
    }

    .oneof-option-header {
        display: flex;
        align-items: baseline;
        gap: 1rem;
        padding: 10px var(--global-padding);
    }

    .oneof-option-desc {
        color: var(--font-color-dimmed);
        font-size: 0.9em;
        padding: 10px var(--global-padding);
    }

    .property-oneof {
        grid-column: 1 / -1;
    }

    :host([compact]) .oneof-selector {
        padding: 8px 0.5rem;
    }

    :host([compact]) .oneof-option-desc {
        display: none;
    }
`]
