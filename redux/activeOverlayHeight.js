import { createSlice } from '@reduxjs/toolkit'

export const activeOverlayHeight = createSlice({
  name: 'activeOverlayHeight',
  initialState: {
    value: 0,
  },
  reducers: {
    set: (state, action) => {
      state.value = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { set } = activeOverlayHeight.actions

export default activeOverlayHeight.reducer