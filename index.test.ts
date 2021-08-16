import MableObject from './index';

describe('MableObject tests', () => {
  test('constructor', () => {
    const m = new MableObject({ one: '1' });

    expect(m.theObject).toEqual({ one: '1' });
  });
});
