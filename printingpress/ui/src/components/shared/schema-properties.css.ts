import {css} from "lit";
import dropdownCss from '../../styles/dropdown.css.js';

export default [dropdownCss, css`
    :host {
        display: block;
        margin-top: var(--global-padding);
        --compact-name-width: 200px;
        --polymorphic-constrained-left-width: 14rem;
        --polymorphic-tab-rail-width: 250px;
        --polymorphic-condensed-tab-rail-width: 170px;
        --polymorphic-compact-tab-rail-width: 13rem;
        --polymorphic-nested-name-width: 14rem;
    }

    .property {
        display: grid;
        grid-template-columns: 200px minmax(300px, auto) 1fr;
        align-items: start;
        gap: 0 var(--global-padding);
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
        gap: 0 var(--global-padding);
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
        padding-right: var(--global-padding);
    }

    .oneof-property-single {
        display: grid;
        grid-template-columns: var(--compact-name-width) minmax(0, 1fr);
        column-gap: var(--global-padding);
        row-gap: 0;
    }

    .oneof-property-single > .oneof-left {
        padding-right: 0;
    }

    .oneof-property-single .oneof-single-panel {
        grid-column: 1 / -1;
    }

    .oneof-prop-name {
        display: grid;
        grid-template-columns: 3.25rem minmax(0, 1fr);
        align-items: start;
        gap: var(--global-padding);
        text-align: right;
        white-space: nowrap;
    }

    .oneof-prop-name .composition-label {
        grid-column: 2;
        justify-self: end;
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
        width: var(--polymorphic-tab-rail-width);
        min-width: var(--polymorphic-tab-rail-width);
    }

    :host([condensed]) .oneof-tabs::part(tabs) {
        width: var(--polymorphic-condensed-tab-rail-width);
        min-width: var(--polymorphic-condensed-tab-rail-width);
    }

    :host([compact]) .oneof-tabs::part(tabs) {
        width: var(--polymorphic-compact-tab-rail-width);
        min-width: var(--polymorphic-compact-tab-rail-width);
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

    .polymorphic-dropdown-row {
        margin-bottom: var(--global-padding);
        min-width: 0;
    }

    .polymorphic-dropdown {
        margin-top: 0;
        max-width: 100%;
    }

    .polymorphic-dropdown sl-button::part(base) {
        border-color: var(--warn-color);
        color: var(--warn-color);
        border-radius: 0;
        min-width: min(16rem, 100%);
        max-width: min(26rem, 100%);
    }

    .polymorphic-dropdown sl-button::part(label) {
        color: var(--warn-color);
        overflow-x: hidden;
        text-overflow: ellipsis;
        text-transform: uppercase;
        letter-spacing: var(--label-spacing);
    }

    .polymorphic-dropdown sl-button::part(caret) {
        color: var(--warn-color);
    }

    .polymorphic-dropdown sl-menu {
        border-color: var(--warn-color);
        border-radius: 0;
    }

    .polymorphic-dropdown sl-menu-item::part(base) {
        color: var(--warn-color);
        font-family: var(--font-stack-bold), monospace;
        text-transform: uppercase;
        letter-spacing: var(--label-spacing);
        --sl-color-neutral-100: var(--warn-color-lowalpha);
    }

    .oneof-dropdown-panel {
        min-width: 0;
        overflow: auto;
    }

    .oneof-single-panel {
        min-width: 0;
        overflow: auto;
    }

    .oneof-single-value {
        align-self: start;
        min-width: 0;
        overflow-x: auto;
        overflow-y: hidden;
        white-space: nowrap;
    }

    .prop-type-col sl-dropdown {
        margin-top: 0;
    }

    .property-oneof {
        grid-column: 1 / -1;
    }

    :host([constrained]) .oneof-property {
        display: grid;
        grid-template-columns: minmax(9rem, min(var(--compact-name-width), var(--polymorphic-constrained-left-width))) minmax(0, 1fr);
        min-width: 0;
    }

    :host([constrained]) .oneof-property > .oneof-left {
        width: auto;
        min-width: 0;
    }

    :host([constrained]) .oneof-prop-name {
        overflow: hidden;
        text-overflow: ellipsis;
    }

    :host([constrained]) .oneof-desc-container {
        min-width: 0;
        overflow: visible;
    }

    :host([constrained]) .oneof-property-single {
        grid-template-columns: minmax(11rem, var(--compact-name-width)) minmax(0, 1fr);
        row-gap: 0;
    }

    :host([constrained]) .oneof-property-single .oneof-single-panel {
        grid-column: 1 / -1;
        min-width: 0;
    }

    :host([popover-context]) .oneof-property-popover-dropdown {
        display: grid;
        grid-template-columns: minmax(9rem, min(var(--compact-name-width), var(--polymorphic-constrained-left-width))) minmax(0, 1fr);
        min-width: 0;
        row-gap: var(--global-padding);
    }

    :host([popover-context]) .oneof-property-popover-dropdown > .oneof-left {
        width: auto;
        min-width: 0;
        padding-right: var(--global-padding);
    }

    :host([popover-context]) .oneof-property-popover-dropdown .oneof-desc-container {
        display: contents;
    }

    :host([popover-context]) .oneof-property-popover-dropdown .polymorphic-dropdown-row {
        margin-bottom: 0;
        align-self: start;
    }

    :host([popover-context]) .oneof-property-popover-dropdown .oneof-dropdown-panel {
        grid-column: 1 / -1;
        min-width: 0;
    }

    :host([constrained][compact]) .oneof-desc-container .property {
        grid-template-columns: minmax(9rem, min(var(--compact-name-width), var(--polymorphic-nested-name-width), 42%)) minmax(0, 1fr);
    }

    :host([constrained][compact]) .oneof-desc-container .prop-type-col {
        min-width: 0;
    }

    :host([compact]) .oneof-container {
        display: block;
    }
`]
