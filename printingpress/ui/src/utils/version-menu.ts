// Printing Press - version menus
// Copyright 2024-2026 Princess Beef Heavy Industries, LLC
//
// A version menu is template markup (the theme's version-picker.html): each
// item's value is the page for that version. Choosing one opens it.

const VERSION_MENU = 'sl-menu[data-catalog-version-menu]';

let bound = false;

/** bindVersionMenus makes every version menu on the page open the version chosen, now and later. */
export function bindVersionMenus() {
  if (bound) {
    return;
  }
  bound = true;
  document.addEventListener('sl-select', (event) => {
    const menu = (event.target as Element | null)?.closest?.(VERSION_MENU);
    const value = (event as CustomEvent<{item?: {value?: string}}>).detail?.item?.value;
    if (menu && value) {
      window.location.href = value;
    }
  });
}
