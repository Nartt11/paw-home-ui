import type * as React from "react";

/**
 * Shared rule for admin tables: clicking a row (or pressing Enter on it) opens its detail.
 * Clicks on controls inside the row — buttons, links, inputs, the ⋮ menu — keep their own meaning.
 */
const INTERACTIVE = "button, a, input, select, textarea, label, [role='menuitem'], [role='checkbox'], [data-row-ignore]";

export function clickableRowProps(open?: () => void) {
  if (!open) return {};

  return {
    tabIndex: 0,
    className: "cursor-pointer focus-visible:bg-muted/60 focus-visible:outline-none",
    onClick: (event: React.MouseEvent<HTMLElement>) => {
      const target = event.target as HTMLElement;
      // Menu items render in a portal: React still bubbles their clicks here, the DOM does not.
      if (!event.currentTarget.contains(target)) return;
      if (target.closest(INTERACTIVE)) return;
      // Selecting text is not a click.
      if (window.getSelection()?.toString()) return;
      open();
    },
    onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
      if (event.target !== event.currentTarget) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open();
      }
    },
  };
}
