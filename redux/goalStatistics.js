import { createSlice } from '@reduxjs/toolkit'

export const goalStatistics = createSlice({
  name: 'goalStatistics',
  initialState: {
    value: {goalsActive: 0, goalsCompleted: 0}
  },
  reducers: {
    set: (state, action) => {
      state.value = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { set } = goalStatistics.actions

export default goalStatistics.reducer