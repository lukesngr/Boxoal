import React from 'react';
import { render, screen } from '@testing-library/react';
import SignedOutNav from '../../components/SignedOutNav';
import '@testing-library/jest-dom';

describe('SignedOutNav', () => {
  it('renders logo and navigation links', () => {
    jest.mock('next/image', (props) => React.createElement('img', props))
    render(<SignedOutNav />);

    const logo = screen.getByAltText('BoxAlc Icon');
    const homeLink = screen.getByText('Home');
    const signInLink = screen.getByText('Sign In');

    expect(logo).toBeInTheDocument();
    expect(homeLink).toBeInTheDocument();
    expect(signInLink).toBeInTheDocument();
  });
});