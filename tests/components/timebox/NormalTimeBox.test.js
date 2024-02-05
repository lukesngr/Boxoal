import React from 'react';
import { render, fireEvent, act, screen } from '@testing-library/react';
import axios from 'axios';
import NormalTimeBox from '@/components/timebox/NormalTimeBox';
import '@testing-library/jest-dom'
import { convertToDateTime } from '@/modules/coreLogic';

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

  test('test clicking record', () => {
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

  test('test clicking end', () => {
    const resumeActiveOverlay = jest.fn();
    const setTimeBoxRecording = jest.fn();
    const pauseActiveOverlay = jest.fn();
    

    const mockProps = {
      schedule: { id: 1, wakeupTime: '07:00', boxSizeNumber: 1, boxSizeUnit: 'hour', goals: [], timeboxes: [], recordedTimeboxes: []},
      time: '12:00', date: '23/1', active: true, dayName: 'Monday',
      data: {recordedTimeBoxes: [], reoccuring: false, id: 1, color: '#123456', title: 'Test Time Box', numberOfBoxes: 1},
      overlayFuncs: [pauseActiveOverlay, resumeActiveOverlay],
      recordFuncs: [[1, '23/1'], setTimeBoxRecording],
    };
    
    render(<NormalTimeBox {...mockProps}></NormalTimeBox>);

    act(() => {fireEvent.click(screen.getByTestId('stopRecording'));});

    expect(resumeActiveOverlay).toHaveBeenCalledTimes(1);
    expect(setTimeBoxRecording).toHaveBeenCalledTimes(1);

    expect(axios.post).toHaveBeenCalledTimes(1);
    
  });

  test('test clicking autorecord', () => {
    const setTimeBoxRecording = jest.fn();
    

    const mockProps = {
      schedule: { id: 1, wakeupTime: '07:00', boxSizeNumber: 1, boxSizeUnit: 'hr', goals: [], timeboxes: [], recordedTimeboxes: []},
      time: '12:00', date: "23/1", active: true, dayName: 'Monday',
      data: {recordedTimeBoxes: [], reoccuring: false, id: 1, color: '#123456', title: 'Test Time Box', numberOfBoxes: 1},
      overlayFuncs: [() => {}, () => {}],
      recordFuncs: [[-1, 0], setTimeBoxRecording],
    };
    
    render(<NormalTimeBox {...mockProps}></NormalTimeBox>);

    act(() => {fireEvent.click(screen.getByTestId('autoRecord'));});

    expect(axios.post).toHaveBeenCalledWith('/api/createRecordedTimebox', 
    {recordedStartTime: convertToDateTime(mockProps.time, mockProps.date), recordedEndTime: convertToDateTime('13:00', mockProps.date), timeBox: {connect: {id: 1}}, schedule: {connect: {id: 1}}});
    
  });
});