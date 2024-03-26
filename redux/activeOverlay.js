import { createSlice } from '@reduxjs/toolkit'

export const activeOverlay = createSlice({
  name: 'activeOverlay',
  initialState: {
    value: {activeOverlayHeight: 0, activeOverlayInterval: useRef(null).current},
  },
  reducers: {
    overallActiveOverlaySet: (state, action) => {
      state.value = action.payload;
    },
    reset: (state) => {
      state.value = {...state, activeOverlayInterval: clearInterval(state.value.activeOverlayInterval)};
    }
  },
})

// Action creators are generated for each case reducer function
export const { set } = activeOverlay.actions

export default activeOverlay.reducer