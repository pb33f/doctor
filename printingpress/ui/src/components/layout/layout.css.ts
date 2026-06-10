import {css} from "lit";
import dropdownCss from '../../styles/dropdown.css.js';

export default [dropdownCss, css`
    :host {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        background: var(--background-color);
    }

    .pp-doc-header {
        position: sticky;
        top: 0;
        z-index: 10;
        display: flex;
        height: 57px;
        flex-direction: row;
        background-color: var(--background-color);
    }

    .pp-doc-header > .logo {
        width: auto;
        min-width: 0;
        max-width: calc(100% - 5rem);
        flex: 1 1 auto;
        white-space: nowrap;
        overflow: hidden;
        padding: 9px 0 10px 10px;
        border-bottom: 1px dashed var(--secondary-color);
        height: 36px;
    }

    .pp-doc-header > .logo .caret {
        font-size: 1.6em;
        color: var(--secondary-color);
    }

    .pp-doc-header > .logo .name {
        display: inline-flex;
        max-width: calc(100% - 1.2em);
        min-width: 0;
        font-size: 1.7em;
        font-family: var(--font-stack-bold), sans-serif;
        color: var(--primary-color);
        text-shadow: 0 0 10px var(--primary-color-text-shadow), 0 0 10px var(--primary-color-text-shadow);
        vertical-align: bottom;
    }

    :host-context(html[theme="light"]) .pp-doc-header > .logo .name {
        text-shadow: none;
    }

    .pp-doc-header > .logo .name > a {
        display: inline-block;
        max-width: 100%;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: inherit;
        text-decoration: none;
    }

    .pp-doc-header > .logo .name > a:hover {
        text-decoration: underline;
    }

    .pp-doc-header > .logo .name > a:active {
        text-decoration: underline;
        color: var(--secondary-color);
        text-shadow: 0 0 5px var(--secondary-color-text-shadow), 0 0 10px var(--secondary-color-text-shadow-outer);
    }

    :host-context(html[theme="light"]) .pp-doc-header > .logo .name > a:active {
        text-shadow: none;
    }

    .pp-doc-header > .logo .name::after {
        content: "";
        animation: cursor .8s infinite;
        background: var(--primary-color);
        border-radius: 0;
        display: inline-block;
        height: 0.9em;
        margin-left: 0.2em;
        width: 3px;
        bottom: -2px;
        position: relative;
    }

    .pp-doc-header .header-space {
        height: 55px;
        flex: 0 0 auto;
        min-width: max-content;
        border-bottom: 1px dashed var(--secondary-color);
    }

    @keyframes cursor {
        0% {
            opacity: 0;
        }

        50% {
            opacity: 1;
        }

        to {
            opacity: 0;
        }
    }

    .header-tools {
        display: flex;
        align-items: flex-start;
        justify-content: flex-end;
        gap: 12px;
        width: 100%;
        height: 55px;
        box-sizing: border-box;
        padding: 0 8px 0 0;
    }

    .header-context {
        display: flex;
        align-items: center;
        gap: 12px;
        min-width: 0;
        flex: 0 0 auto;
    }

    .version-picker {
        display: flex;
        align-items: center;
        min-width: 0;
        margin-left: 0;
        margin-top: 8px;
    }

    .version-picker sl-dropdown {
        margin-top: 0;
    }

    .version-picker sl-button::part(base) {
        min-width: 120px;
        max-width: 220px;
    }

    .theme-controls {
        flex: 0 0 auto;
        margin-top: var(--global-padding-half);
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 0;
        min-width: 4.5rem;
        min-height: 2.25rem;
    }

    .theme-icon-button {
        width: 2.25rem;
        height: 2.25rem;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin: 0;
        padding: 0;
        border: none;
        border-radius: 0;
        background: transparent;
        color: var(--secondary-color);
        cursor: pointer;
    }

    .theme-icon-button sl-icon {
        width: 1.4rem;
        height: 1.4rem;
        font-size: 1.4rem;
    }

    .theme-icon-button:hover,
    .theme-icon-button:focus-visible {
        color: var(--primary-color);
    }

    .theme-icon-button:focus-visible {
        outline: 1px solid var(--secondary-color);
        outline-offset: 2px;
    }

    .theme-icon-button.tek-active {
        color: #33ff33;
        text-shadow: 0 0 8px rgba(51, 255, 51, 0.6);
    }

    sl-split-panel {
        flex: 1;
        --divider-width: 10px;
        --min: 200px;
        --max: 40%;
    }

    :host([embedded]) sl-split-panel {
        height: 100vh;
    }

    sl-split-panel::part(divider) {
        cursor: col-resize;
        touch-action: none;
        background: linear-gradient(
            to right,
            transparent 0,
            transparent 4px,
            var(--secondary-color) 4px,
            var(--secondary-color) 6px,
            transparent 6px,
            transparent 100%
        );
    }

    sl-icon.divider-vert {
        position: absolute;
        left: 0;
        border-radius: 0;
        background: var(--secondary-color);
        color: var(--background-color);
        cursor: col-resize;
        padding: 0;
        width: 10px;
        height: 40px;
    }

    sl-split-panel::part(divider):focus-visible {
        background-color: var(--primary-color);
    }

    sl-split-panel:focus-within sl-icon {
        background-color: var(--primary-color);
        color: var(--background-color);
    }

    .nav-panel,
    .content-panel {
        overflow-y: auto;
        scroll-behavior: auto;
        height: calc(100vh - var(--pp-header-height, 57px));
        scrollbar-width: thin;
        scrollbar-color: var(--secondary-color-lowalpha) var(--terminal-background);
    }

    :host([embedded]) .nav-panel,
    :host([embedded]) .content-panel {
        height: 100vh;
    }

    .nav-panel::-webkit-scrollbar,
    .content-panel::-webkit-scrollbar {
        width: 8px;
    }

    .nav-panel::-webkit-scrollbar-track,
    .content-panel::-webkit-scrollbar-track {
        background-color: var(--terminal-background);
    }

    .nav-panel::-webkit-scrollbar-thumb,
    .content-panel::-webkit-scrollbar-thumb {
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        background: var(--secondary-color-lowalpha);
    }

    .nav-panel {
        background: var(--background-color);
    }

    .content-panel {
    }

    @media (max-width: 900px) {
        .header-tools {
            height: auto;
            flex-wrap: wrap;
            padding-right: 0;
        }

        .header-context {
            width: 100%;
            flex-wrap: wrap;
        }

        .version-picker {
            width: 100%;
            margin-top: 0;
        }

        .version-picker sl-dropdown,
        .version-picker sl-button::part(base) {
            width: 100%;
        }

        .theme-controls {
            width: 100%;
            justify-content: flex-end;
        }
    }
`]
