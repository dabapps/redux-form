import isPromise from 'is-promise';
import asyncValidation from '../asyncValidation';

describe('asyncValidation', () => {
  const field = 'myField';

  it('should throw an error if fn does not return a promise', () => {
    const fn = () => null;
    const start = () => null;
    const stop = () => null;
    expect(() => asyncValidation(fn, start, stop, field))
      .toThrow(/promise/);
  });

  it('should return a promise', () => {
    const fn = () => Promise.resolve();
    const start = () => null;
    const stop = () => null;
    expect(isPromise(asyncValidation(fn, start, stop, field))).toBe(true);
  });

  it('should call start, fn, and stop on promise resolve', () => {
    const fn = jest.fn().mockImplementation(() => Promise.resolve());
    const start = jest.fn();
    const stop = jest.fn();
    const promise = asyncValidation(fn, start, stop, field);
    expect(fn).toHaveBeenCalled();
    expect(start).toHaveBeenCalled();
    expect(start).toHaveBeenCalledWith(field);
    return promise.then(() => {
      expect(stop).toHaveBeenCalled();
    }, () => {
      expect(false).toBe(true); // should not get into reject branch
    });
  });

  it('should throw when promise rejected with no errors', () => {
    const fn = jest.fn().mockImplementation(() => Promise.reject());
    const start = jest.fn();
    const stop = jest.fn();
    const promise = asyncValidation(fn, start, stop, field);
    expect(fn).toHaveBeenCalled();
    expect(start).toHaveBeenCalled();
    expect(start).toHaveBeenCalledWith(field);
    return promise.then(() => {
      expect(false).toBe(true); // should not get into resolve branch
    }, () => {
      expect(stop).toHaveBeenCalled();
    });
  });

  it('should call start, fn, and stop on promise reject', () => {
    const errors = {foo: 'error'};
    const fn = jest.fn().mockImplementation(() => Promise.reject(errors));
    const start = jest.fn();
    const stop = jest.fn();
    const promise = asyncValidation(fn, start, stop, field);
    expect(fn).toHaveBeenCalled();
    expect(start).toHaveBeenCalled();
    expect(start).toHaveBeenCalledWith(field);
    return promise.then(() => {
      expect(false).toBe(true); // should not get into resolve branch
    }, () => {
      expect(stop).toHaveBeenCalled();
      expect(stop).toHaveBeenCalledWith(errors);
    });
  });
});
