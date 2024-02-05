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
    expect(userImage).toHaveAttribute('width', '45');
    expect(userImage).toHaveAttribute('height', '45');
  });
});