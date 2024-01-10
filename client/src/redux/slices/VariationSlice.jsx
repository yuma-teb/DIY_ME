import { createSlice } from '@reduxjs/toolkit';

const variationSlice = createSlice({
  name: 'variation',
  initialState: {
    addVariationCard: [],
  },
  reducers: {
    addVariation: (state, action) => {
      console.log('Payload', action.payload);
      state.addVariationCard.push(action.payload);
    },
    removeVariation: (state, action) => {
      const idToRemove = action.payload;
      state.addVariationCard = state.addVariationCard.filter(variation => variation.id !== idToRemove);
    },
    clearVariations: (state) => {
      state.addVariationCard = [];
    },
    setVariations: (state, action) => {
      state.addVariationCard = action.payload;
    },
  },
});

export const { addVariation, removeVariation, clearVariations, setVariations } = variationSlice.actions;
export const variationsReducer = variationSlice.reducer;
