import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateTimeboxForm from '@/components/form/CreateTimeboxForm'; 


jest.mock('axios', () => ({
  post: jest.fn(() => Promise.resolve({})),
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
    expect(screen.getByLabelText(/goals/i)).toBeInTheDocument();
    expect(screen.getByTestId('reoccurFrequency')).toBeInTheDocument();
  });

  
});