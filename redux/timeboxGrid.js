import { createSlice } from '@reduxjs/toolkit'

export const timeboxGrid = createSlice({
  name: 'timeboxGrid',
  initialState: {
    value: new Map(),
  },
  reducers: {
    set: (state, action) => {
      state.value = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { set } = timeboxGrid.actions

export default timeboxGrid.reducer