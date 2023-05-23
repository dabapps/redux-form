import createOnBlur from '../createOnBlur';

describe('createOnBlur', () => {
  it('should return a function', () => {
    expect(createOnBlur()).toBeTruthy();
    expect(typeof createOnBlur()).toBe('function');
  });

  it('should return a function that calls blur with name and value', () => {
    const blur = jest.fn();
    createOnBlur('foo', blur)('bar');
    expect(blur).toHaveBeenCalled();
    expect(blur).toHaveBeenCalledWith('foo', 'bar');
  });

  it('should return a function that calls blur with name and value from event', () => {
    const blur = jest.fn();
    createOnBlur('foo', blur)({
      target: {
        value: 'bar'
      },
      preventDefault: () => null,
      stopPropagation: () => null
    });
    expect(blur).toHaveBeenCalled();
    expect(blur).toHaveBeenCalledWith('foo', 'bar');
  });

  it('should return a function that calls blur and then afterBlur with name and value', () => {
    const blur = jest.fn();
    const afterBlur = jest.fn();
    createOnBlur('foo', blur, false, afterBlur)('bar');
    expect(blur).toHaveBeenCalled();
    expect(afterBlur).toHaveBeenCalled();
    expect(afterBlur).toHaveBeenCalledWith('foo', 'bar');
  });

});
