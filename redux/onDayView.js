import { createSlice } from '@reduxjs/toolkit'

export const onDayView = createSlice({
  name: 'onDayView',
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
export const { set } = onDayView.actions

export default onDayView.reducer