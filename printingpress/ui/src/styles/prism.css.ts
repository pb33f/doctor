// Prism.js token styles for PrintingPress shadow-DOM components.
// Base styles imported from cowboy-components; overrides below.
import prismBaseCss from '@pb33f/cowboy-components/css/prism.css.js';
export { prismBaseCss };
import {css} from "lit";

// --- PrintingPress overrides (diverge from cowboy-components defaults) ---
export const prismOverrideCss = css`
  /* Override: number tokens use tertiary instead of secondary */
  .token.number {
    color: var(--tertiary-color);
  }

  /* Override: function/class-name tokens use secondary instead of terminal-text */
  .token.attr-value,
  .token.function,
  .token.class-name {
    color: var(--secondary-color);
  }

  /* Override: keyword/null tokens use secondary instead of primary */
  .token.keyword,
  .token.null {
    color: var(--secondary-color);
  }
`;

export default prismOverrideCss;
