import { configureStore } from '@reduxjs/toolkit'
import scheduleEssentialsReducer from './scheduleEssentials'
import { thunk } from 'redux-thunk'

export default configureStore({
  reducer: {
    scheduleEssentials: scheduleEssentialsReducer,
    middleware: [thunk],
  },
})