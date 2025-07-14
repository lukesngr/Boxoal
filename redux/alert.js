import { createSlice } from '@reduxjs/toolkit'

export const alert = createSlice({
  name: 'alert',
  initialState: {
    value: { open: false, title: "", message: "" },
  },
  reducers: {
    set: (state, action) => {
      state.value = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { set } = alert.actions

export default alert.reducer