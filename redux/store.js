import { configureStore } from '@reduxjs/toolkit'
import scheduleEssentialsReducer from './scheduleEssentials'
import overlayDimensionsReducer from './overlayDimensions'
import activeOverlayHeightReducer from './activeOverlayHeight'
import activeOverlayIntervalReducer from './activeOverlayInterval'
import scheduleDataReducer from './scheduleData'
import timeboxGridReducer from './timeboxGrid'
import timeboxRecordingReducer from './timeboxRecording'
import timeboxDialogReducer from './timeboxDialog'

export default configureStore({
  reducer: {
    scheduleEssentials: scheduleEssentialsReducer,
    overlayDimensions: overlayDimensionsReducer,
    activeOverlayHeight: activeOverlayHeightReducer,
    activeOverlayInterval: activeOverlayIntervalReducer,
    scheduleData: scheduleDataReducer,
    timeboxGrid: timeboxGridReducer,
    timeboxRecording: timeboxRecordingReducer,
    timeboxDialog: timeboxDialogReducer,
  },
})