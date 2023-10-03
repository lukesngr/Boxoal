import React from 'react';
import { render, screen } from '@testing-library/react';
import SignedOutNav from '../../components/SignedOutNav';
import '@testing-library/jest-dom';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    return <img {...props} />
  },
}))

describe('SignedOutNav', () => {
  it('renders logo and navigation links', () => {
    render(<SignedOutNav />);

    const logo = screen.getByAltText('BoxAlc Icon');
    const homeLink = screen.getByText('Home');
    const signInLink = screen.getByText('Sign In');

    expect(logo).toBeInTheDocument();
    expect(homeLink).toBeInTheDocument();
    expect(signInLink).toBeInTheDocument();
  });
});