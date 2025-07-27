import { createSlice } from '@reduxjs/toolkit'

export const goalLimit = createSlice({
  name: 'goalLimit',
  initialState: {
    value: 1,
  },
  reducers: {
    set: (state, action) => {
      state.value = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { set } = goalLimit.actions

export default goalLimit.reducer