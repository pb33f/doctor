import {css} from 'lit';

export default css`
  .pp-markdown,
  .pp-markdown-inline {
    color: var(--font-color-sub1);
  }

  .pp-markdown > :first-child,
  .pp-markdown-inline > :first-child {
    margin-top: 0;
  }

  .pp-markdown > :last-child,
  .pp-markdown-inline > :last-child {
    margin-bottom: 0;
  }

  .pp-markdown p,
  .pp-markdown ul,
  .pp-markdown ol,
  .pp-markdown pre,
  .pp-markdown blockquote {
    margin: 0 0 var(--global-padding) 0;
  }

  .pp-markdown ul,
  .pp-markdown ol {
    padding-left: 1.35rem;
  }

  .pp-markdown li + li {
    margin-top: calc(var(--global-padding) / 2);
  }

  .pp-markdown a,
  .pp-markdown-inline a {
    color: var(--primary-color);
    text-decoration: none;
  }

  .pp-markdown a:hover,
  .pp-markdown-inline a:hover {
    text-decoration: underline;
  }

  .pp-markdown code,
  .pp-markdown-inline code {
    font-family: var(--font-stack), monospace;
    color: var(--primary-color);
    background: color-mix(in srgb, var(--background-color) 80%, black);
    border: 1px dotted var(--secondary-color-dimmer);
    padding: 0 0.25rem;
  }

  .pp-markdown pre {
    overflow-x: auto;
    padding: var(--global-padding);
    border-left: 2px solid var(--secondary-color);
    background: color-mix(in srgb, var(--background-color) 88%, black);
  }

  .pp-markdown pre code {
    border: none;
    padding: 0;
    background: transparent;
  }

  .pp-markdown blockquote {
    margin-left: 0;
    padding-left: var(--global-padding-double);
    border-left: 2px solid var(--warn-color);
    color: var(--font-color-sub2);
  }

  .pp-markdown-inline {
    display: inline-block;
  }

  .pp-markdown-inline p {
    display: inline;
    margin: 0;
  }
`;
