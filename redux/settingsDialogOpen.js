import { createSlice } from '@reduxjs/toolkit'
import dayjs from 'dayjs'

export const settingsDialogOpen = createSlice({
  name: 'settingsDialogOpen',
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
export const { set } = settingsDialogOpen.actions

export default settingsDialogOpen.reducer