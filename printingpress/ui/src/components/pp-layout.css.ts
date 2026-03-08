import {css} from "lit";

export default css`
  :host {
    display: grid;
    grid-template-rows: auto 1fr;
    grid-template-columns: var(--pp-nav-width, 300px) 1fr;
    grid-template-areas:
      "header header"
      "nav content";
    min-height: 100vh;
    background: var(--background-color, #0d1117);
  }

  pb33f-header {
    grid-area: header;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  pb33f-theme-switcher {
    margin-left: auto;
  }

  ::slotted([slot='nav']) {
    grid-area: nav;
    background: var(--background-color, #0d1117);
    border-right: 1px dashed var(--secondary-color-dimmer, rgba(248, 58, 255, 0.45));
    overflow-y: auto;
    position: sticky;
    top: var(--pp-header-height, 57px);
    height: calc(100vh - var(--pp-header-height, 57px));
  }

  ::slotted([slot='content']) {
    grid-area: content;
    padding: 2rem 3rem;
    max-width: 1000px;
  }
`
