import React from 'react';
import { render, fireEvent, act, screen } from '@testing-library/react';
import axios from 'axios';
import NormalTimeBox from '@/components/timebox/NormalTimeBox';
import '@testing-library/jest-dom'

jest.mock('axios', () => ({
    post: jest.fn(() => Promise.resolve({ data: {}})),
}));
  
beforeEach(() => {
    jest.clearAllMocks();
});

describe('NormalTimeBox component', () => {

  //there's three different states of a timebox, gonna test them all now

  test('render with no buttons', () => {
    const mockProps = {
      schedule: { id: 1, wakeupTime: '07:00', boxSizeNumber: 1, boxSizeUnit: 'hour', goals: [], timeboxes: [], recordedTimeboxes: []},
      time: '12:00', date: '2024-01-23', active: true, dayName: 'Monday',
      data: {recordedTimeBoxes: [], reoccuring: false, id: 1, color: '#123456', title: 'Test Time Box', numberOfBoxes: 1},
      overlayFuncs: [() => {}, () => {}],
      recordFuncs: [[], () => {}],
    };
    
    render(<NormalTimeBox {...mockProps}></NormalTimeBox>);

    expect(screen.queryByTestId('startRecording')).not.toBeInTheDocument();
    expect(screen.queryByTestId('stopRecording')).not.toBeInTheDocument();
    
  });

  test('render with start buttons', () => {
    const mockProps = {
      schedule: { id: 1, wakeupTime: '07:00', boxSizeNumber: 1, boxSizeUnit: 'hour', goals: [], timeboxes: [], recordedTimeboxes: []},
      time: '12:00', date: '2024-01-23', active: true, dayName: 'Monday',
      data: {recordedTimeBoxes: [], reoccuring: false, id: 1, color: '#123456', title: 'Test Time Box', numberOfBoxes: 1},
      overlayFuncs: [() => {}, () => {}],
      recordFuncs: [[-1, 0], () => {}],
    };
    
    render(<NormalTimeBox {...mockProps}></NormalTimeBox>);

    expect(screen.queryByTestId('startRecording')).toBeInTheDocument();
    expect(screen.queryByTestId('stopRecording')).not.toBeInTheDocument();
    
  });

  test('test clicking record and end', () => {
    let mockDate = new Date('2023-06-21')
    jest.useFakeTimers("modern");
    jest.setSystemTime(mockDate);
    const resumeActiveOverlay = jest.fn();
    const pauseActiveOverlay = jest.fn();
    const setTimeBoxRecording = jest.fn();
    const mockProps = {
      schedule: { id: 1, wakeupTime: '07:00', boxSizeNumber: 1, boxSizeUnit: 'hour', goals: [], timeboxes: [], recordedTimeboxes: []},
      time: '12:00', date: '2024-01-23', active: true, dayName: 'Monday',
      data: {recordedTimeBoxes: [], reoccuring: false, id: 1, color: '#123456', title: 'Test Time Box', numberOfBoxes: 1},
      overlayFuncs: [pauseActiveOverlay, resumeActiveOverlay],
      recordFuncs: [[-1, 0], setTimeBoxRecording],
    };
    
    render(<NormalTimeBox {...mockProps}></NormalTimeBox>);

    act(() => {fireEvent.click(screen.getByTestId('startRecording'));});

    expect(pauseActiveOverlay).toHaveBeenCalledTimes(1);
    expect(setTimeBoxRecording).toHaveBeenCalledTimes(1);
    
  });

  /*test('when timebox has data, timebox pops up', () => {
    const mockProps = {
      schedule: { id: 1, wakeupTime: '07:00', boxSizeNumber: 1, boxSizeUnit: 'hour', goals: [], timeboxes: [], recordedTimeboxes: []},
      time: '12:00', date: '2024-01-23', active: true, dayName: 'Monday',
      data: {
        id: 1,
        numberOfBoxes: 1,
        color: '#123456',
        title: 'Test Time Box',
        recordedTimeBoxes: [],
        reoccuring: false,
      },
      overlayFuncs: [jest.fn(), jest.fn()],
    };

    render(<TimeboxContextProvider><div id="portalRoot"></div><TimeBox {...mockProps} /></TimeboxContextProvider>);

    expect(screen.getByTestId('normalTimeBox')).toBeInTheDocument();
    
  });*/
});