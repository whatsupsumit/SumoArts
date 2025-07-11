import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import HomePage from "../../src/pages/HomePage";

// Mock auth context
// Replaces the actual AuthContext with a mock object.
const mockUseAuth = vi.fn();
vi.mock("../src/contexts/AuthContext", () => ({
  useAuth: () => mockUseAuth(),
  AuthContext: { Provider: ({ children }) => children },
}));

// Mock navigate
// Overrides the useNavigate function to use mockNavigate, letting you verify navigation behavior.
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Helper function to render the HomePage
const renderHomePage = (mockAuthReturnValue) => {
  mockUseAuth.mockReturnValue(mockAuthReturnValue);
  render(
    <BrowserRouter>
      <HomePage />
    </BrowserRouter>
  );
};

describe("Homepage Artists & Art Lovers Buttons", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockUseAuth.mockClear();
  });

  // *********************
  // FOR ARTISTS PINK BUTTON
  // *********************

  it("button displays 'Manage your art gallery' and navigates to /artist-dashboard when user is artist", () => {
    renderHomePage({
      currentUser: { email: "artist@test.com" },
      isArtist: () => true,
      cart: [],
    });

    const artistsButton = screen.getByTestId("artists-button");
    expect(artistsButton).toHaveTextContent("Manage your art gallery");
    expect(artistsButton).not.toHaveTextContent("Open your own art gallery");
    fireEvent.click(artistsButton);
    expect(mockNavigate).toHaveBeenCalledWith("/artist-dashboard");
    expect(mockNavigate).not.toHaveBeenCalledWith("/dashboard");
    expect(mockNavigate).not.toHaveBeenCalledWith("/login");
    expect(mockNavigate).not.toHaveBeenCalledWith("/favorites");
    expect(mockNavigate).not.toHaveBeenCalledWith("/cart");
    expect(mockNavigate).not.toHaveBeenCalledWith("/for-art-lovers");
  });

  it("button displays 'Open your own art gallery' and navigates to /become-artist when user is art lover", () => {
    renderHomePage({
      currentUser: { email: "artlover@test.com" },
      isArtist: () => false,
      cart: [],
    });

    const artistsButton = screen.getByTestId("artists-button");
    expect(artistsButton).toHaveTextContent("Open your own art gallery");
    expect(artistsButton).not.toHaveTextContent("Manage your art gallery");
    fireEvent.click(artistsButton);
    expect(mockNavigate).toHaveBeenCalledWith("/become-artist");
    expect(mockNavigate).not.toHaveBeenCalledWith("/artist-dashboard");
    expect(mockNavigate).not.toHaveBeenCalledWith("/dashboard");
    expect(mockNavigate).not.toHaveBeenCalledWith("/login");
    expect(mockNavigate).not.toHaveBeenCalledWith("/favorites");
    expect(mockNavigate).not.toHaveBeenCalledWith("/cart");
    expect(mockNavigate).not.toHaveBeenCalledWith("/for-art-lovers");
  });

  it("button displays 'Open your own art gallery' and redirects to /login when user is guest", () => {
    renderHomePage({
      currentUser: null,
      isArtist: () => false,
      cart: [],
    });

    const artistsButton = screen.getByTestId("artists-button");
    expect(artistsButton).toHaveTextContent("Open your own art gallery");
    expect(artistsButton).not.toHaveTextContent("Manage your art gallery");
    fireEvent.click(artistsButton);
    expect(mockNavigate).toHaveBeenCalledWith("/login");
    expect(mockNavigate).not.toHaveBeenCalledWith("/artist-dashboard");
    expect(mockNavigate).not.toHaveBeenCalledWith("/dashboard");
    expect(mockNavigate).not.toHaveBeenCalledWith("/become-artist");
    expect(mockNavigate).not.toHaveBeenCalledWith("/favorites");
    expect(mockNavigate).not.toHaveBeenCalledWith("/cart");
    expect(mockNavigate).not.toHaveBeenCalledWith("/for-art-lovers");
  });

  // *********************
  // FOR ART LOVERS BLUE BUTTON
  // *********************

  it("button displays 'Discover art exhibitions' and navigates to /-for-art-lovers for any type of user", () => {
    renderHomePage({
      currentUser: { email: "artist@test.com" } || null,
      isArtist: () => true || false,
      cart: [],
    });

    const artLoversButton = screen.getByTestId("art-lovers-button");
    expect(artLoversButton).toHaveTextContent("Discover art exhibitions");
    expect(artLoversButton).not.toHaveTextContent("Manage your art gallery");
    expect(artLoversButton).not.toHaveTextContent("Open your own art gallery");
    fireEvent.click(artLoversButton);
    expect(mockNavigate).toHaveBeenCalledWith("/for-art-lovers");
    expect(mockNavigate).not.toHaveBeenCalledWith("/artist-dashboard");
    expect(mockNavigate).not.toHaveBeenCalledWith("/dashboard");
    expect(mockNavigate).not.toHaveBeenCalledWith("/login");
    expect(mockNavigate).not.toHaveBeenCalledWith("/favorites");
    expect(mockNavigate).not.toHaveBeenCalledWith("/cart");
  });
});
