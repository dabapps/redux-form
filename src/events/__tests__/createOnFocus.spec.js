import createOnFocus from '../createOnFocus';

describe('createOnFocus', () => {
  it('should return a function', () => {
    expect(createOnFocus()).toBeTruthy();
    expect(typeof createOnFocus()).toBe('function');
  });

  it('should return a function that calls focus with name', () => {
    const focus = jest.fn();
    createOnFocus('foo', focus)();
    expect(focus).toHaveBeenCalled();
    expect(focus).toHaveBeenCalledWith('foo');
  });
});
