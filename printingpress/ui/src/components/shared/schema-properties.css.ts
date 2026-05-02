import {css} from "lit";
import dropdownCss from '../../styles/dropdown.css.js';

export default [dropdownCss, css`
    :host {
        display: block;
        margin-top: var(--global-padding);
        --compact-name-width: 200px;
    }

    .property {
        display: grid;
        grid-template-columns: 200px minmax(300px, auto) 1fr;
        align-items: start;
        gap: 0 1rem;
        padding: 15px var(--global-padding);
        border-bottom: 1px dotted var(--hrcolor);
    }

    .property:last-child, .property:last-of-type {
        border-bottom: none;
    }
    
    .prop-name-col {
        display: grid;
        grid-template-columns: 3.25rem minmax(0, 1fr);
        align-items: start;
        align-self: start;
        gap: var(--global-padding);
        white-space: nowrap;
    }

    .prop-type-col {
        align-self: start;
        white-space: nowrap;
    }

    .prop-desc-col {
        align-self: start;
        padding-left: var(--global-padding);
        color: var(--font-color-sub1)
    }

    .prop-name {
        font-family: var(--font-stack-bold), monospace;
        color: var(--font-color);
        justify-self: end;
        text-align: right;
    }
    .prop-name.required {
        color: var(--error-color);
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
        box-sizing: border-box;
        justify-self: start;
        text-transform: uppercase;
        letter-spacing: var(--label-spacing);
    }

    .required-badge-placeholder {
        visibility: hidden;
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
        grid-template-columns: minmax(11rem, var(--compact-name-width)) minmax(8rem, 1fr);
        padding: 8px 0.5rem;
    }

    :host([compact]) .prop-desc-col {
        display: none;
    }

    :host([compact]) .prop-type-col {
        min-width: 8rem;
        overflow-x: auto;
        overflow-y: hidden;
    }

    :host([compact]) .prop-type {
        display: inline-block;
        white-space: nowrap;
        overflow-wrap: normal;
        word-break: normal;
    }

    :host([compact]) a.ref-type-link {
        white-space: nowrap;
        overflow-wrap: normal;
        word-break: normal;
    }

    :host([compact]) .composition-ref-entry {
        grid-template-columns: auto minmax(8rem, 1fr);
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
        padding: var(--global-padding);
        border-bottom: 1px dotted var(--hrcolor);
    }

    .composition-label {
        display: block;
        text-transform: uppercase;
        letter-spacing: var(--label-spacing);
        font-family: var(--font-stack), monospace;
        margin-bottom: var(--global-padding);
        color: var(--font-color-sub1);
    }

    .composition-label.polymorphic {
        color: var(--warn-color);
    }

    .composition-ref-entry {
        display: grid;
        grid-template-columns: 200px minmax(300px, auto) 1fr;
        gap: 0 1rem;
        align-items: baseline;
        padding: 4px 0;
    }

    .composition-ref-link {
        grid-column: 1 / 3;
    }

    .composition-ref-desc {
        color: var(--font-color-sub1);
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
        display: block;
    }

    .oneof-property {
        display: flex;
        align-items: stretch;
        padding: 15px var(--global-padding);
        border-bottom: 1px dotted var(--hrcolor);
    }

    .oneof-property > .oneof-left {
        width: var(--compact-name-width);
        min-width: var(--compact-name-width);
        padding-right: 1rem;
    }

    .oneof-prop-name {
        text-align: right;
        white-space: nowrap;
    }

    .oneof-desc-container {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-width: 0;
    }

    .oneof-prop-desc {
        color: var(--font-color-sub1);
        padding-top: var(--global-padding);
        text-align: right;
    }

    .oneof-option-desc {
        padding: var(--global-padding);
        color: var(--font-color-sub1);
        font-size: 0.9em;
        border-bottom: 1px dotted var(--hrcolor);
    }

    .oneof-option-scalar {
        padding: var(--global-padding);
    }

    .oneof-tabs {
        --indicator-color: var(--warn-color);
        --track-color: transparent;
        --sl-transition-x-fast: 0s;
        flex: 1;
        min-width: 0;
    }

    .oneof-tabs::part(base) {
        height: 100%;
        gap: 0;
    }

    .oneof-tabs::part(nav) {
        display: flex;
        flex-direction: column;
        height: 100%;
        border-inline-end: var(--global-padding) solid var(--warn-color);
    }

    .oneof-tabs::part(tabs) {
        flex: 1;
        width: 250px;
        min-width: 250px;
    }

    :host([condensed]) .oneof-tabs::part(tabs) {
        width: 170px;
        min-width: 170px;
    }

    :host([compact]) .oneof-tabs::part(tabs) {
        width: 13rem;
        min-width: 13rem;
    }

    .oneof-tabs::part(body) {
        overflow: auto;
        min-width: 13rem;
    }

    .oneof-tabs sl-tab {
        width: 100%;
    }

    .oneof-tabs sl-tab::part(base) {
        display: flex;
        width: 100%;
        font-family: var(--font-stack-bold), monospace;
        text-transform: uppercase;
        letter-spacing: var(--label-spacing);
        padding: 0.5rem 0.8rem;
        color: var(--warn-color);
        border-radius: 0;
        margin-inline-end: -1px;
    }

    .oneof-tabs sl-tab[active]::part(base) {
        color: var(--background-color);
        background-color: var(--warn-color);
        border-radius: 0;
        margin-inline-end: -1px;
    }

    .oneof-tabs sl-tab-panel::part(base) {
        padding: 0 0 0 var(--global-padding);
    }

    .prop-type-col sl-dropdown {
        margin-top: 0;
    }

    .property-oneof {
        grid-column: 1 / -1;
    }

    :host([compact]) .oneof-container {
        display: block;
    }
`]
