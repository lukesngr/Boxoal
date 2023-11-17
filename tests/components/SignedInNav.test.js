import React from 'react';
import { render, screen } from '@testing-library/react';
import SignedInNav from '../../components/nav/SignedInNav';
import '@testing-library/jest-dom';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    return <img {...props} />
  },
}))

describe('SignedInNav', () => {
  test('displays user image', () => {
    const userImageSrc = 'user-image-url.jpg'; // Replace with a sample image URL
    render(<SignedInNav session={{ user: { image: userImageSrc } }} />);
    const userImage = screen.getByAltText('User Image');
    expect(userImage).toBeInTheDocument();
    expect(userImage).toHaveAttribute('src', userImageSrc);
    expect(userImage).toHaveAttribute('width', '30');
    expect(userImage).toHaveAttribute('height', '30');
  });

  test('displays user email', () => {
    const userEmail = 'test@example.com'; // Replace with a sample email
    const { getByText } = render(<SignedInNav session={{ user: { email: userEmail } }} />);
    const emailElement = screen.getByText(userEmail);
    expect(emailElement).toBeInTheDocument();
  });
});