import { configureStore } from '@reduxjs/toolkit'
import scheduleEssentialsReducer from './scheduleEssentials'

export default configureStore({
  reducer: {
    scheduleEssentials: scheduleEssentialsReducer,
  },
})