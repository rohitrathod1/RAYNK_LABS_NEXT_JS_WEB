// UI state slice — ephemeral client-side UI toggles only.
// Rule: NO server data here. Server data lives in TanStack Query.

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  mobileNavOpen: boolean;
  sidebarCollapsed: boolean;
  activeModal: string | null; // e.g. "create-service", "delete-project"
}

const initialState: UIState = {
  mobileNavOpen: false,
  sidebarCollapsed: false,
  activeModal: null,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleMobileNav: (state) => { state.mobileNavOpen = !state.mobileNavOpen; },
    closeMobileNav: (state) => { state.mobileNavOpen = false; },
    toggleSidebar: (state) => { state.sidebarCollapsed = !state.sidebarCollapsed; },
    openModal: (state, action: PayloadAction<string>) => { state.activeModal = action.payload; },
    closeModal: (state) => { state.activeModal = null; },
  },
});

export const { toggleMobileNav, closeMobileNav, toggleSidebar, openModal, closeModal } =
  uiSlice.actions;
