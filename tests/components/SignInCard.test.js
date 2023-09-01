import React from 'react';
import { render, screen } from '@testing-library/react';
import SignInCard from '../../components/SignInCard.js';
import '@testing-library/jest-dom';

describe('SignInCard', () => {
    test('displays "Sign in" button and handles click', () => {
        const { getByText } = render(<SignInCard />);
        const signInButton = getByText('Sign in');
        expect(signInButton).toBeInTheDocument();
      
        // Mock the signIn function from next-auth/react
        const signInMock = jest.fn();
        jest.mock('next-auth/react', () => ({
          signIn: signInMock,
        }));
      
        // Simulate a click on the "Sign in" button
        fireEvent.click(signInButton);
      
        // Verify that the signIn function was called
        expect(signInMock).toHaveBeenCalled();
      });
})