import {css} from 'lit';

export default css`
    :host {
        display: flex;
        align-items: first baseline;
        gap: var(--global-padding);
    }

    pb33f-model-icon {
        flex-shrink: 0;
    }

    h1, h2, h3, h4 {
        margin: 0;
        padding: 0;
        font-family: var(--font-stack-bold), monospace;
        font-weight: normal;
        overflow-wrap: anywhere;
        min-width: 0;
    }
`;
