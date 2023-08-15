import React from 'react';
import { render, screen } from '@testing-library/react';
import UnSignedNav from '../../components/UnSignedNav';
import '@testing-library/jest-dom'

describe('UnSignedNav', () => {
  it('renders logo and navigation links', () => {
    render(<UnSignedNav />);

    const logo = screen.getByAltText('BoxAlc Icon');
    const homeLink = screen.getByText('Home');
    const signInLink = screen.getByText('Sign In');

    expect(logo).toBeInTheDocument();
    expect(homeLink).toBeInTheDocument();
    expect(signInLink).toBeInTheDocument();
  });

  it('opens collapsible content when button is clicked', () => {
    render(<UnSignedNav />);

    const button = screen.getByLabelText('Collapse content');
    const collapsibleContent = screen.getByTestId('collapsible-content');

    expect(collapsibleContent).not.toBeVisible();

    button.click();

    expect(collapsibleContent).toBeVisible();
  });
});