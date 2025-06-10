import { render } from '@testing-library/react';
import App from './App';

test('renders welcome message', () => {
  const { getByText } = render(<App />);
  expect(getByText(/Doggo Network/i)).toBeInTheDocument();
});
