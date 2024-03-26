import { configureStore } from '@reduxjs/toolkit'
import scheduleEssentialsReducer from './scheduleEssentials'
import overlayDimensionsReducer from './overlayDimensions'
import { thunk } from 'redux-thunk'

export default configureStore({
  reducer: {
    scheduleEssentials: scheduleEssentialsReducer,
    overlayDimensions: overlayDimensionsReducer,
    middleware: [thunk],
  },
})