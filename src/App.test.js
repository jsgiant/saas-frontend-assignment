// App.test.js
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";
import axios from "axios";
jest.mock("axios");

test("renders Kickstarter Projects title", () => {
  render(<App />);
  const titleElement = screen.getByText(/Kickstarter Projects/i);
  expect(titleElement).toBeInTheDocument();
});

test("displays loading state initially", () => {
  render(<App />);
  const loadingElement = screen.getByText(/Loading projects.../i);
  expect(loadingElement).toBeInTheDocument();
});

test("handles error state", async () => {
  axios.get.mockRejectedValueOnce(new Error("API is down"));
  render(<App />);
  const errorElement = await screen.findByText(
    /Failed to fetch data. Please try again later./i
  );
  expect(errorElement).toBeInTheDocument();
});

test("renders projects and pagination buttons", async () => {
  const mockData = [
    { "percentage.funded": 186, "amt.pledged": 15283 },
    { "percentage.funded": 90, "amt.pledged": 12000 },
    { "percentage.funded": 150, "amt.pledged": 30000 },
    { "percentage.funded": 200, "amt.pledged": 45000 },
    { "percentage.funded": 100, "amt.pledged": 25000 },
    { "percentage.funded": 75, "amt.pledged": 18000 },
  ];

  axios.get.mockResolvedValueOnce({ data: mockData });
  render(<App />);

  await waitFor(() => {
    expect(screen.getByText("15283")).toBeInTheDocument();
  });

  const nextPageButton = screen.getByTestId("page-2");
  expect(nextPageButton).toBeInTheDocument();
  fireEvent.click(nextPageButton);

  await waitFor(() => {
    expect(screen.getByText("75")).toBeInTheDocument();
    // expect(screen.getByText("18000")).toBeInTheDocument();
  });
});
