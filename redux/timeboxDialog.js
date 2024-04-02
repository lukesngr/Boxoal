import { createSlice } from '@reduxjs/toolkit'

export const timeboxDialog = createSlice({
  name: 'timeboxDialog',
  initialState: {
    value: false,
  },
  reducers: {
    set: (state, action) => {
      state.value = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { set } = timeboxDialog.actions

export default timeboxDialog.reducer