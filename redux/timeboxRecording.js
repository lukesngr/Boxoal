import { createSlice } from '@reduxjs/toolkit'

export const timeboxRecording = createSlice({
  name: 'timeboxRecording',
  initialState: {
    value: [-1, 0],
  },
  reducers: {
    set: (state, action) => {
      state.value = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { set } = timeboxRecording.actions

export default timeboxRecording.reducer