import { createSlice } from '@reduxjs/toolkit'

export const scheduleEssentials = createSlice({
  name: 'scheduleEssentials',
  initialState: {
    value: {boxSizeUnit: 'hr', boxSizeNumber: 1, wakeupTime: '06:00'},
  },
  reducers: {
    set: (state, action) => {
      state.value = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { set } = scheduleEssentials.actions

export default scheduleEssentials.reducer