import React from 'react';
import { render, screen, fireEvent,waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateTimeboxForm from '@/components/form/CreateTimeboxForm';
import axios from 'axios';
import { act } from 'react-dom/test-utils';

jest.mock('axios', () => ({
  post: jest.fn(() => Promise.resolve({ data: {}})),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('CreateTimeboxForm', () => {
  test('test no goal warning', () => {
    const mockProps = {
        schedule: {wakeupTime: "7:00", timeboxes: [], goals: []}, time: "7:30", date: "8/5", closeTimeBox: function(){}, dayName: 'Sat', timeBoxFormVisible: true, listOfColors: ["#fdsfds"],
        numberOfBoxes: [2, function(){}],
        titleFunc: ["Go gym", function(){}]
    };

    render(<CreateTimeboxForm {...mockProps} />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/boxes/i)).toBeInTheDocument();
    expect(screen.getByTestId('reoccurFrequency')).toBeInTheDocument();
    expect(screen.getByTestId('noGoalsWarning')).toBeInTheDocument();
    expect(screen.getByTestId('addTimeBox')).toHaveAttribute('disabled');
  });

  test('test input field appear normally', () => {
    const mockProps = {
        schedule: {wakeupTime: "7:00", timeboxes: [], goals: [{id: 5, name: "example"}]}, time: "7:30", date: "8/5", closeTimeBox: function(){}, dayName: 'Sat', timeBoxFormVisible: true, listOfColors: ["#fdsfds"],
        numberOfBoxes: [2, function(){}],
        titleFunc: ["Go gym", function(){}]
    };

    render(<CreateTimeboxForm {...mockProps} />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/boxes/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/goal/i)).toBeInTheDocument();
    expect(screen.getByTestId('reoccurFrequency')).toBeInTheDocument();
    expect(screen.getByTestId('addTimeBox')).not.toHaveAttribute('disabled');
  });

  

  test('submits the form successfully', async () => {

    const mockProps = {
      schedule: {wakeupTime: "7:00", timeboxes: [], goals: [{id: 5, name: "example"}]}, time: "7:30", date: "8/5", closeTimeBox: function(){}, dayName: 'Sat', timeBoxFormVisible: true, listOfColors: ["#fdsfds"],
      numberOfBoxes: [2, function(){}],
      titleFunc: ["Go gym", function(){}]
    };

    render(<CreateTimeboxForm {...mockProps} />);

    fireEvent.change(screen.getByLabelText(/goal/i), { target: { value: '5' } });

    act(() => {fireEvent.click(screen.getByTestId('addTimeBox'))});

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/api/createTimebox', expect.any(Object));
    });

  });

  test('if goal is null cant submit', async () => {

    const mockProps = {
      schedule: {wakeupTime: "7:00", timeboxes: [], goals: []}, time: "7:30", date: "8/5", closeTimeBox: function(){}, dayName: 'Sat', timeBoxFormVisible: true, listOfColors: ["#fdsfds"],
      numberOfBoxes: [2, function(){}],
      titleFunc: ["Go gym", function(){}]
    };

    render(<CreateTimeboxForm {...mockProps} />);

    act(() => {fireEvent.click(screen.getByTestId('addTimeBox'))});

    await waitFor(() => {
      expect(axios.post).not.toHaveBeenCalledWith('/api/createTimebox', expect.any(Object));
    });

  });

  test('if weekly reoccuring ', async () => {

    const mockProps = {
      schedule: {wakeupTime: "7:00", timeboxes: [], goals: [{id: 5, name: "example"}]}, time: "7:30", date: "8/5", closeTimeBox: function(){}, dayName: 'Sat', timeBoxFormVisible: true, listOfColors: ["#fdsfds"],
      numberOfBoxes: [2, function(){}],
      titleFunc: ["Go gym", function(){}]
    };

    render(<CreateTimeboxForm {...mockProps} />);

    fireEvent.change(screen.getByLabelText(/goal/i), { target: { value: '5' } });
    fireEvent.change(screen.getByTestId('reoccurFrequency'), { target: { value: 'weekly' } });
    fireEvent.change(screen.getByTestId('weeklyDate'), { target: { value: '2024-05-07' } });

    await waitFor(() => {fireEvent.click(screen.getByTestId('addTimeBox'))});

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/api/createTimebox', {
        title: 'Go gym',
        description: '',
        startTime: new Date('2024-05-07T21:30:00.000Z'),
        endTime: new Date('2024-05-07T21:30:00.000Z'),  
        numberOfBoxes: 2,
        color: '#fdsfds',
        schedule: { connect: { id: undefined } },
        goal: { connect: { id: 5 } },
        reoccuring: { create: { reoccurFrequency: 'weekly', weeklyDay: 2 } }
      });
    })

  });

  
});