import { createSlice } from '@reduxjs/toolkit'
import dayjs from 'dayjs'

export const selectedDate = createSlice({
  name: 'selectedDate',
  initialState: {
    value: dayjs().toISOString(),
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
