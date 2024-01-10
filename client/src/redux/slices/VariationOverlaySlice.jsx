import { createSlice } from '@reduxjs/toolkit';

const variationOverlaySlice = createSlice({
  name: 'variationOverlay',
  initialState: {
    initOverlay: false,
  },
  reducers: {
    openOverlay: (state) => {
      state.initOverlay = !state.initOverlay;
    },
  },
});

export const { openOverlay } = variationOverlaySlice.actions;
export const variationOverlayReducer = variationOverlaySlice.reducer;
