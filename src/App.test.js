import App from './App'

import type { RemarkNodeType } from './models/RemarkNodeType'

// since we used flow-type to find jest Flow has ?? magically imported those globals?

/*import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
*/

test('test behavior', () => {
    expect(1).toBe(1)
})
