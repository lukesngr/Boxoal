import DoubleKeyMap from '@/modules/doubleKeyMap';
import { createSlice } from '@reduxjs/toolkit'

export const scheduleData = createSlice({
  name: 'scheduleData',
  initialState: {
    value: {title: '', timeboxes: new DoubleKeyMap, recordedTimeboxes: new DoubleKeyMap(), goals: new DoubleKeyMap()},
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
