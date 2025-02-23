import { createSlice } from '@reduxjs/toolkit'

export const expanded = createSlice({
  name: 'expanded',
  initialState: {
    value: true,
  },
  reducers: {
    set: (state, action) => {
      state.value = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { set } = expanded.actions

export default expanded.reducer