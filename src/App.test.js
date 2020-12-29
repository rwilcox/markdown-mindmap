import App from './App'

// since we used flow-type to find jest Flow has ?? magically imported those globals?

/*import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
*/



test('correctly puts subheadings under the correct headline', () => {
    let t = new App( {} )

    expect( t.organizeHeadingEntries() ).toBe(2)
})
