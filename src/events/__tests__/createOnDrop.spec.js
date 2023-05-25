import createOnDrop from '../createOnDrop';
import { dataKey } from '../createOnDragStart';

describe('createOnDrop', () => {
  it('should return a function', () => {
    expect(createOnDrop()).toBeTruthy();
    expect(typeof createOnDrop()).toBe('function');
  });

  it('should return a function that calls change with result from getData', () => {
    const change = jest.fn();
    const getData = jest.fn().mockImplementation(() => 'bar');
    createOnDrop(
      'foo',
      change
    )({
      dataTransfer: { getData },
    });
    expect(getData).toHaveBeenCalled();
    expect(getData).toHaveBeenCalledWith(dataKey);
    expect(change).toHaveBeenCalled();
    expect(change).toHaveBeenCalledWith('foo', 'bar');
  });
});
