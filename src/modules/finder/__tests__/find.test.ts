import { expect, test } from 'vitest';
import Finder from '../finder';

function getExampleDOM() {
  const div = document.createElement('div');
  div.innerHTML = `
      <label for="username">Username</label>
      <input id="username" />
      <button>Print Username</button>
    `;
  return div;
}

test('FindElement', () => {
  const container = getExampleDOM();
  // expect(FindElement(1, 2)).toBe(3);
});
