import { createSlice } from '@reduxjs/toolkit'

export const selectedDate = createSlice({
  name: 'selectedDate',
  initialState: {
    value: new Date().toUTCString(),
  },
  reducers: {
    set: (state, action) => {
      state.value = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { set } = selectedDate.actions

export default selectedDate.reducer