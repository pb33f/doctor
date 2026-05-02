import {css} from 'lit';

export default css`
    :host {
        display: block;
        margin-top: var(--global-padding-double);
    }

    .summary {
        display: flex;
        flex-wrap: wrap;
        gap: var(--global-padding);
        margin-bottom: var(--global-padding-double);
    }

    .diagnostics-tabs {
        --indicator-color: var(--primary-color);
        --track-color: var(--primary-color);
        display: block;
    }

    .diagnostics-tabs::part(tabs) {
        border-bottom: 1px dashed var(--hrcolor);
    }

    .diagnostics-tabs::part(active-tab-indicator) {
        --track-color: var(--primary-color);
    }

    .diagnostics-tabs sl-tab::part(base) {
        font-family: var(--font-stack), monospace;
        text-transform: uppercase;
        font-size: 1rem;
        color: var(--font-color-sub1);
    }

    .diagnostics-tabs sl-tab[active]::part(base) {
        color: var(--primary-color);
    }

    .diagnostics-tabs sl-tab-panel::part(base) {
        padding: var(--global-padding-double) 0 0;
    }

    .list-toolbar {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-bottom: var(--global-padding);
    }

    .sort-filter {
        display: flex;
        align-items: center;
        gap: var(--global-padding);
        color: var(--font-color-sub1);
        font-family: var(--font-stack), monospace;
        text-transform: uppercase;
        font-size: 0.9rem;
        letter-spacing: var(--label-spacing);
    }

    .sort-label {
        color: var(--font-color-sub1);
    }

    sl-button::part(base) {
        border: 1px solid var(--primary-color);
        border-radius: 0;
        background: var(--background-color);
        color: var(--primary-color);
        font-family: var(--font-stack), monospace;
    }

    sl-button::part(label) {
        text-transform: uppercase;
        letter-spacing: var(--label-spacing);
    }

    sl-menu {
        border: 1px solid var(--primary-color);
        border-radius: 0;
    }

    sl-menu-item::part(base) {
        color: var(--primary-color);
        font-family: var(--font-stack), monospace;
        font-size: 0.7rem;
        line-height: 1rem;
        --sl-color-neutral-100: var(--secondary-color-lowalpha);
        text-transform: uppercase;
        letter-spacing: var(--label-spacing);
    }

    .stat {
        display: grid;
        grid-template-columns: auto auto auto;
        align-items: center;
        gap: var(--global-padding);
        min-width: 6rem;
        padding: var(--global-padding);
        border: 1px dashed var(--hrcolor);
        font-family: var(--font-stack), monospace;
    }

    .stat sl-icon {
        width: 1rem;
        height: 1rem;
    }

    .stat span {
        font-family: var(--font-stack-bold), monospace;
        font-size: 1.25rem;
        font-variant-numeric: tabular-nums;
    }

    .stat small,
    .location {
        color: var(--font-color-sub1);
        text-transform: uppercase;
        letter-spacing: var(--label-spacing);
        font-size: var(--smallest-font);
    }

    .stat.err sl-icon,
    .stat.err span {
        color: var(--error-color, #ff5572);
    }

    .stat.warn sl-icon,
    .stat.warn span {
        color: var(--warn-color, #ffca5f);
    }

    .stat.info sl-icon,
    .stat.info span {
        color: var(--secondary-color);
    }

  .list {
    display: grid;
    gap: 1px;
    border-top: 1px dashed var(--hrcolor);
  }

  pb33f-paginator {
    display: block;
  }

  .grouped-list {
    display: grid;
    gap: calc(var(--global-padding-double) * 1.5);
  }

  .problem-group {
    display: grid;
    gap: var(--global-padding);
  }

  .group-header {
    display: flex;
    justify-content: space-between;
    gap: var(--global-padding);
    align-items: center;
  }

  .group-title {
    display: inline-flex;
    align-items: center;
    gap: var(--global-padding);
    min-width: 0;
  }

  .group-title h2 {
    margin: 0;
    color: var(--font-color);
    font-family: var(--font-stack-bold), monospace;
    font-size: 1.35rem;
    line-height: 1.2;
  }

  .group-actions {
    display: inline-flex;
    align-items: center;
    gap: var(--global-padding);
    flex: 0 0 auto;
  }

  .group-actions .sort-filter {
    font-size: 0.8rem;
  }

  .group-count {
    flex: 0 0 auto;
    padding: 0.25rem 0.5rem;
    border: 1px solid var(--hrcolor);
    color: var(--font-color);
    font-family: var(--font-stack), monospace;
    font-size: 0.9rem;
    font-variant-numeric: tabular-nums;
  }

  .row {
        display: grid;
        grid-template-columns: 1.5rem 4.75rem minmax(18rem, 1fr) minmax(16rem, 24rem);
        gap: var(--global-padding);
        align-items: center;
        padding: 0.75rem 0;
        color: var(--font-color);
        border-bottom: 1px dashed var(--hrcolor);
    }

    .row:hover {
        background: var(--primary-color-verylowalpha);
    }

    .severity {
        display: grid;
        place-items: center;
        color: var(--font-color-sub1);
    }

    .severity-icon {
        width: 1.1rem;
        height: 1.1rem;
    }

    .row.err .severity-icon {
        color: var(--error-color, #ff5572);
    }

    .row.warn .severity-icon {
        color: var(--warn-color, #ffca5f);
    }

    .row.info .severity-icon {
        color: var(--secondary-color);
    }

    .location {
        font-variant-numeric: tabular-nums;
    }

    .message {
        color: var(--font-color);
        overflow-wrap: anywhere;
    }

    .message-link {
        display: block;
        min-width: 0;
        color: inherit;
        text-decoration: none;
    }

    .message-link:hover,
    .message-link:focus-visible {
        text-decoration: none;
    }

    .message-link:hover .message,
    .message-link:focus-visible .message {
        color: var(--primary-color);
    }

    .message-link:focus-visible {
        outline: 1px solid var(--primary-color);
        outline-offset: 3px;
    }

    .page {
        display: inline-flex;
        align-items: center;
        gap: 0.75rem;
        min-width: 0;
        justify-self: end;
        color: var(--primary-color);
        font-size: 0.9rem;
        text-decoration: none;
    }

    .page:hover {
        text-decoration: none;
    }

    .page-model span {
        min-width: 0;
        color: var(--font-color);
        font-family: var(--font-stack-bold), monospace;
        overflow-wrap: anywhere;
    }

    .page-operation {
        text-transform: none;
        letter-spacing: 0;
    }

    .operation-label {
        min-width: 0;
        color: var(--font-color);
        font-family: var(--font-stack), monospace;
        overflow-wrap: anywhere;
    }

    .page-operation pb33f-http-method {
        flex: 0 0 auto;
    }

    .empty-page {
        color: var(--font-color-sub1);
    }

    .empty {
        padding: var(--global-padding-double) 0;
        color: var(--font-color-sub1);
        font-family: var(--font-stack), monospace;
    }

    @media (max-width: 760px) {
        .group-header {
            align-items: flex-start;
            flex-direction: column;
        }

        .group-actions {
            align-items: flex-start;
            flex-direction: column;
        }

        .row {
            grid-template-columns: 1fr;
            gap: 0.25rem;
        }
    }
`;
