import createOnChange from '../createOnChange';

describe('createOnChange', () => {
  it('should return a function', () => {
    expect(createOnChange()).toBeTruthy();
    expect(typeof createOnChange()).toBe('function');
  });

  it('should return a function that calls change with name and value', () => {
    const change = jest.fn();
    createOnChange('foo', change)('bar');
    expect(change).toHaveBeenCalled();
    expect(change).toHaveBeenCalledWith('foo', 'bar');
  });

});
