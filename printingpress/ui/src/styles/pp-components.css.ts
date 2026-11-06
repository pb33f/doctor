// Printing Press component styles inside shadow roots.
// Copyright 2026 Princess Beef Heavy Industries, LLC
//
// The components from @pb33f/printing-press-components render in light DOM and
// take their styles from the page. Until Printing Press's own components move
// to light DOM too (docs-sites step 6b), the ones that draw library components
// inside a shadow root adopt the library styles there. Tokens still come from
// the page, because custom properties cross shadow boundaries.
import {unsafeCSS} from 'lit';
import componentsCss from '@pb33f/printing-press-components/styles/components.css?inline';

export default unsafeCSS(componentsCss);
