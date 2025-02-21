import { createSlice } from '@reduxjs/toolkit'

export const profile = createSlice({
  name: 'profile',
  initialState: {
    value: {scheduleID: 0, scheduleIndex: 0, boxSizeUnit: 'min', boxSizeNumber: 30, wakeupTime: '07:00'},
  },
  reducers: {
    set: (state, action) => {
      state.value = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { set } = profile.actions

export default profile.reducer