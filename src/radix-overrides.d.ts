// Override Radix UI component types to accept className and children props
// This is needed because newer Radix versions removed these from their types
// but shadcn/ui components still pass them through
import '@radix-ui/react-alert-dialog';
import '@radix-ui/react-avatar';
import '@radix-ui/react-accordion';
import '@radix-ui/react-label';
import '@radix-ui/react-progress';
import '@radix-ui/react-scroll-area';
import '@radix-ui/react-separator';
import '@radix-ui/react-slider';
import '@radix-ui/react-switch';
import '@radix-ui/react-tabs';
import '@radix-ui/react-toggle';
import '@radix-ui/react-toggle-group';
import '@radix-ui/react-tooltip';
import '@radix-ui/react-checkbox';
import '@radix-ui/react-collapsible';
import '@radix-ui/react-context-menu';
import '@radix-ui/react-dialog';
import '@radix-ui/react-dropdown-menu';
import '@radix-ui/react-hover-card';
import '@radix-ui/react-menubar';
import '@radix-ui/react-navigation-menu';
import '@radix-ui/react-popover';
import '@radix-ui/react-radio-group';
import '@radix-ui/react-select';

declare module '@radix-ui/react-alert-dialog' {
  interface AlertDialogOverlayProps { className?: string; }
  interface AlertDialogContentProps { className?: string; children?: React.ReactNode; }
  interface AlertDialogTitleProps { className?: string; }
  interface AlertDialogDescriptionProps { className?: string; }
  interface AlertDialogActionProps { className?: string; }
  interface AlertDialogCancelProps { className?: string; }
  interface AlertDialogHeaderProps { className?: string; children?: React.ReactNode; }
}

declare module '@radix-ui/react-avatar' {
  interface AvatarProps { className?: string; }
  interface AvatarImageProps { className?: string; }
  interface AvatarFallbackProps { className?: string; }
}

declare module '@radix-ui/react-accordion' {
  interface AccordionItemProps { className?: string; }
  interface AccordionTriggerProps { className?: string; children?: React.ReactNode; }
  interface AccordionContentProps { className?: string; children?: React.ReactNode; }
  interface AccordionHeaderProps { className?: string; children?: React.ReactNode; }
}

declare module '@radix-ui/react-label' {
  interface LabelProps { className?: string; }
}

declare module '@radix-ui/react-progress' {
  interface ProgressProps { className?: string; children?: React.ReactNode; }
  interface ProgressIndicatorProps { className?: string; style?: React.CSSProperties; }
}

declare module '@radix-ui/react-scroll-area' {
  interface ScrollAreaProps { className?: string; children?: React.ReactNode; }
  interface ScrollAreaViewportProps { className?: string; children?: React.ReactNode; }
  interface ScrollAreaScrollbarProps { className?: string; children?: React.ReactNode; }
  interface ScrollAreaThumbProps { className?: string; }
  interface ScrollAreaCornerProps { className?: string; }
}

declare module '@radix-ui/react-separator' {
  interface SeparatorProps { className?: string; }
}

declare module '@radix-ui/react-slider' {
  interface SliderProps { className?: string; children?: React.ReactNode; }
  interface SliderTrackProps { className?: string; children?: React.ReactNode; }
  interface SliderRangeProps { className?: string; }
  interface SliderThumbProps { className?: string; }
}

declare module '@radix-ui/react-switch' {
  interface SwitchProps { className?: string; children?: React.ReactNode; }
  interface SwitchThumbProps { className?: string; }
}

declare module '@radix-ui/react-tabs' {
  interface TabsListProps { className?: string; }
  interface TabsTriggerProps { className?: string; }
  interface TabsContentProps { className?: string; }
}

declare module '@radix-ui/react-toggle' {
  interface ToggleProps { className?: string; }
}

declare module '@radix-ui/react-toggle-group' {
  interface ToggleGroupSingleProps { className?: string; }
  interface ToggleGroupMultipleProps { className?: string; }
  interface ToggleGroupItemProps { className?: string; }
}

declare module '@radix-ui/react-tooltip' {
  interface TooltipContentProps { className?: string; children?: React.ReactNode; }
  interface TooltipTriggerProps { className?: string; }
}

declare module '@radix-ui/react-checkbox' {
  interface CheckboxProps { className?: string; children?: React.ReactNode; }
  interface CheckboxIndicatorProps { className?: string; children?: React.ReactNode; }
}

declare module '@radix-ui/react-collapsible' {
  interface CollapsibleContentProps { className?: string; children?: React.ReactNode; }
}

declare module '@radix-ui/react-context-menu' {
  interface ContextMenuContentProps { className?: string; children?: React.ReactNode; }
  interface ContextMenuItemProps { className?: string; }
  interface ContextMenuCheckboxItemProps { className?: string; children?: React.ReactNode; }
  interface ContextMenuRadioItemProps { className?: string; children?: React.ReactNode; }
  interface ContextMenuLabelProps { className?: string; }
  interface ContextMenuSeparatorProps { className?: string; }
  interface ContextMenuSubContentProps { className?: string; }
  interface ContextMenuSubTriggerProps { className?: string; }
}

declare module '@radix-ui/react-dialog' {
  interface DialogOverlayProps { className?: string; }
  interface DialogContentProps { className?: string; children?: React.ReactNode; }
  interface DialogTitleProps { className?: string; }
  interface DialogDescriptionProps { className?: string; }
  interface DialogCloseProps { className?: string; }
}

declare module '@radix-ui/react-dropdown-menu' {
  interface DropdownMenuContentProps { className?: string; children?: React.ReactNode; }
  interface DropdownMenuItemProps { className?: string; }
  interface DropdownMenuCheckboxItemProps { className?: string; children?: React.ReactNode; }
  interface DropdownMenuRadioItemProps { className?: string; children?: React.ReactNode; }
  interface DropdownMenuLabelProps { className?: string; }
  interface DropdownMenuSeparatorProps { className?: string; }
  interface DropdownMenuSubContentProps { className?: string; }
  interface DropdownMenuSubTriggerProps { className?: string; }
}

declare module '@radix-ui/react-hover-card' {
  interface HoverCardContentProps { className?: string; }
}

declare module '@radix-ui/react-menubar' {
  interface MenubarMenuProps { className?: string; }
  interface MenubarTriggerProps { className?: string; }
  interface MenubarContentProps { className?: string; }
  interface MenubarItemProps { className?: string; }
  interface MenubarSeparatorProps { className?: string; }
  interface MenubarLabelProps { className?: string; }
  interface MenubarCheckboxItemProps { className?: string; children?: React.ReactNode; }
  interface MenubarRadioItemProps { className?: string; children?: React.ReactNode; }
  interface MenubarSubContentProps { className?: string; }
  interface MenubarSubTriggerProps { className?: string; }
}

declare module '@radix-ui/react-navigation-menu' {
  interface NavigationMenuProps { className?: string; children?: React.ReactNode; }
  interface NavigationMenuListProps { className?: string; }
  interface NavigationMenuContentProps { className?: string; }
  interface NavigationMenuTriggerProps { className?: string; children?: React.ReactNode; }
  interface NavigationMenuViewportProps { className?: string; }
  interface NavigationMenuIndicatorProps { className?: string; children?: React.ReactNode; }
  interface NavigationMenuLinkProps { className?: string; }
}

declare module '@radix-ui/react-popover' {
  interface PopoverContentProps { className?: string; children?: React.ReactNode; }
}

declare module '@radix-ui/react-radio-group' {
  interface RadioGroupProps { className?: string; children?: React.ReactNode; }
  interface RadioGroupItemProps { className?: string; children?: React.ReactNode; }
  interface RadioGroupIndicatorProps { className?: string; children?: React.ReactNode; }
}

declare module '@radix-ui/react-select' {
  interface SelectTriggerProps { className?: string; children?: React.ReactNode; }
  interface SelectContentProps { className?: string; children?: React.ReactNode; }
  interface SelectItemProps { className?: string; children?: React.ReactNode; }
  interface SelectLabelProps { className?: string; }
  interface SelectSeparatorProps { className?: string; }
  interface SelectScrollUpButtonProps { className?: string; children?: React.ReactNode; }
  interface SelectScrollDownButtonProps { className?: string; children?: React.ReactNode; }
}
