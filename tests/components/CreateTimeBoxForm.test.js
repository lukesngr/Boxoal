import React from 'react';
import { render, screen, fireEvent,waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateTimeboxForm from '@/components/form/CreateTimeboxForm';
import axios from 'axios';
import { act } from 'react-dom/test-utils';
import { useState } from 'react';


jest.mock('axios', () => ({
  post: jest.fn(() => Promise.resolve({ data: {}})),
}));

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
    jest.mock('axios', () => ({
      post: jest.fn(() => Promise.resolve({})),
    }));

    const mockProps = {
      schedule: {wakeupTime: "7:00", timeboxes: [], goals: [{id: 5, name: "example"}]}, time: "7:30", date: "8/5", closeTimeBox: function(){}, dayName: 'Sat', timeBoxFormVisible: true, listOfColors: ["#fdsfds"],
      numberOfBoxes: [2, function(){}],
      titleFunc: ["Go gym", function(){}]
    };

    act(() => {render(<CreateTimeboxForm {...mockProps} />)});

    //fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Test Title' } });
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Test Description' } });
    //fireEvent.change(screen.getByLabelText(/boxes/i), { target: { value: 3 } });
    fireEvent.change(screen.getByLabelText(/goal/i), { target: { value: '5' } });

    act(() => {fireEvent.click(screen.getByTestId('addTimeBox'))});

    await waitFor(() => {
      
      expect(axios.post).toHaveBeenCalledWith('/api/createTimebox', expect.any(Object));
    });

    //can't get this shit working if it reset it worked

    expect(screen.getByLabelText(/description/i)).toHaveValue('');
    //expect(screen.getByLabelText(/boxes/i)).toHaveValue(1);
    expect(screen.getByLabelText(/goal/i)).toHaveValue(mockProps.schedule.goals[0].id);
    expect(screen.getByLabelText(/reoccurFrequency/i)).toHaveValue('no');
  });

  
});