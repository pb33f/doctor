import {css} from 'lit';
import dropdownCss from '../../styles/dropdown.css.js';

export default [dropdownCss, css`
    :host {
        display: block;
        min-height: 156px;
    }

    .selector-row {
        display: flex;
        align-items: center;
        gap: var(--global-padding-double);
        margin-bottom: var(--global-padding);
    }

    .selector {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
    }

    sl-dropdown {
        margin-top: 0;
    }

    .curl-skeleton-row {
        margin-bottom: var(--global-padding);
    }

    .curl-skeleton-button,
    .curl-skeleton-terminal,
    .curl-skeleton-line {
        background: var(--secondary-color-lowalpha);
        border: 1px dotted var(--hrcolor);
    }

    .curl-skeleton-button {
        width: 13rem;
        height: 2rem;
    }

    .curl-skeleton-terminal {
        min-height: 108px;
        padding: 1rem;
        display: grid;
        gap: 0.85rem;
    }

    .curl-skeleton-line {
        height: 1rem;
        width: 100%;
    }

    .curl-skeleton-line.short {
        width: 42%;
    }

    .curl-skeleton-line.mid {
        width: 74%;
    }

`];
