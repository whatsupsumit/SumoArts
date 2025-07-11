import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import BecomeArtist from "../../src/pages/BecomeArtist";

const mockUseAuth = vi.fn();
vi.mock('../src/contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth()
}));

describe('BecomeArtist', () => {
  it('shows coming soon when not logged in', () => {
    mockUseAuth.mockReturnValue({ currentUser: null });
    render(
      <BrowserRouter>
        <BecomeArtist />
      </BrowserRouter>
    );
    expect(screen.getByText('Coming Soon')).toBeInTheDocument();
  });

  it('shows upgrade message when logged in', () => {
    mockUseAuth.mockReturnValue({ 
      currentUser: { email: 'test@example.com' }
    });
    render(
      <BrowserRouter>
        <BecomeArtist />
      </BrowserRouter>
    );
    expect(screen.getByText('Upgrade Your Account')).toBeInTheDocument();
  });
});
