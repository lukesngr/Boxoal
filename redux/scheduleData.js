import { createSlice } from '@reduxjs/toolkit'

export const scheduleData = createSlice({
  name: 'scheduleData',
  initialState: {
    value: {timeboxes: new Map(), recordedTimeboxes: new Map(), goals: new Map()},
  },
  reducers: {
    set: (state, action) => {
      state.value = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { set } = scheduleData.actions

export default scheduleData.reducer
