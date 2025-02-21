import { createSlice } from '@reduxjs/toolkit'

export const daySelected = createSlice({
  name: 'daySelected',
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
export const { set } = daySelected.actions

export default daySelected.reducer