import { createSlice } from '@reduxjs/toolkit'

export const modalVisible = createSlice({
  name: 'modalVisible',
  initialState: {
    value: {visible: false, props: []},
  },
  reducers: {
    set: (state, action) => {
      state.value = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { set } = modalVisible.actions

export default modalVisible.reducer