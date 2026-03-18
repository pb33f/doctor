import {css} from "lit";

export default css`
    :host {
        display: block;
        margin: 0 0 var(--global-padding) 0; 
    }

    .tag-header {
        display: flex;
        align-items: center;
        cursor: pointer;
        padding: var(--global-padding) 0 var(--global-padding) 0;
        font-family: var(--font-stack), monospace;
        color: var(--font-color);

    }

    .tag-header sl-icon {
        margin-right: var(--global-padding);
        padding-left: var(--global-padding);
    }

    .tag-header:hover {
        background: var(--primary-color-verylowalpha);
        color: var(--primary-color);
    }

    .tag-header.active {
        color: var(--primary-color);
        border-left: 2px solid var(--primary-color);
        background: var(--primary-color-verylowalpha);
    }
    
    .tag-body {
        padding: var(--global-padding) 0 var(--global-padding) 0;
    }
    
    .chevron {
        color: var(--secondary-color);
        padding-left: var(--global-padding);
    }

    .tag-header:hover .chevron,
    .tag-header.active .chevron {
        color: var(--primary-color);
    }

    .tag-description {
        padding: var(--global-padding) var(--global-padding) var(--global-padding) 22px;
        font-size: var(--smaller-font);
        color: var(--font-color-sub1);
        font-family: var(--font-stack), monospace;
    }


    ul {
        list-style: none;
        margin: 0 0 0 15px;
        padding: var(--global-padding) 0 var(--global-padding) var(--global-padding);
        border-left: 1px dashed var(--secondary-color-dimmer);
        border-top: 1px dashed var(--secondary-color-dimmer);
        border-bottom: 1px dashed var(--secondary-color-dimmer);
    }

    li a {
        display: flex;
        align-items: baseline;
        gap: 0.4rem;
        padding: 0.2rem 0.4rem;
        border-radius: 0;
        color: var(--font-color);
        text-decoration: none;
        border-left: 2px solid var(--background-color);
    }

    li a:hover {
        background: var(--primary-color-verylowalpha);
        text-decoration: none;
        border-left: 2px solid var(--secondary-color);
    }

    li a.active {
        background: var(--primary-color-verylowalpha);
        border-left: 2px solid var(--primary-color);
        font-family: var(--font-stack-bold), monospace;
        color: var(--primary-color);
    }
    
    .op-title {
        flex: 1;
        min-width: 0;
        max-width: var(--nav-op-max-width);
        font-family: var(--font-stack), monospace;
        font-size: var(--smaller-font);
        word-wrap: break-word;
        overflow-wrap: break-word;
        white-space: normal;
    }

    li a.active .op-title {
        font-family: var(--font-stack-bold), monospace;
    }
    
    .children {
        margin-left: 15px;
        margin-bottom: var(--global-padding);
        border-left: 1px dashed var(--secondary-color-dimmer);
    }

    .deprecated {
        text-decoration: line-through;
        opacity: 0.5;
    }
`
