import {css} from 'lit';
import dropdownCss from '../../styles/dropdown.css.js';

export default [dropdownCss, css`
    :host {
        display: block;
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

`];
