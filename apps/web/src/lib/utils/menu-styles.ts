/** Shared visual primitives for floating command menus. */
export const floatingMenuSurfaceClassName =
  'z-50 overflow-hidden rounded-sm border border-gunmetal/60 bg-obsidian/95 text-titanium shadow-xl backdrop-blur-xs';

export const floatingMenuAnimationClassName =
  'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2';

export const menuItemBaseClassName =
  'rounded-xs relative flex select-none items-center text-sm outline-none transition-colors';
