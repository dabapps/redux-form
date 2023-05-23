import createOnDragStart, { dataKey } from '../createOnDragStart';

describe('createOnDragStart', () => {
  it('should return a function', () => {
    expect(createOnDragStart()).toBeTruthy();
    expect(typeof createOnDragStart()).toBe('function');
  });

  it('should return a function that calls dataTransfer.setData with key and result from getValue', () => {
    const getValue = jest.fn().mockImplementation(() => 'bar');
    const setData = jest.fn();
    createOnDragStart(
      'foo',
      getValue
    )({
      dataTransfer: { setData },
    });
    expect(getValue).toHaveBeenCalled();
    expect(setData).toHaveBeenCalled();
    expect(setData).toHaveBeenCalledWith(dataKey, 'bar');
  });
});
