import silenceEvents from '../silenceEvents';

describe('silenceEvents', () => {
  it('should return a function', () => {
    expect(silenceEvents()).toBeTruthy();
    expect(typeof silenceEvents()).toBe('function');
  });

  it('should return pass all args if first arg is not event', () => {
    const spy = jest.fn();
    const silenced = silenceEvents(spy);

    silenced(1, 2, 3);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(1, 2, 3);
    spy.mockClear();

    silenced('foo', 'bar');
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith('foo', 'bar');
    spy.mockClear();

    silenced({ value: 10 }, false);
    expect(spy).toHaveBeenCalled();

    expect(spy).toHaveBeenCalledWith(
      {
        value: 10,
      },
      false
    );

    spy.mockClear();
  });

  it('should return pass other args if first arg is event', () => {
    const spy = jest.fn();
    const silenced = silenceEvents(spy);
    const event = {
      preventDefault: () => null,
      stopPropagation: () => null,
    };

    silenced(event, 1, 2, 3);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(1, 2, 3);
    spy.mockClear();

    silenced(event, 'foo', 'bar');
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith('foo', 'bar');
    spy.mockClear();

    silenced(event, { value: 10 }, false);
    expect(spy).toHaveBeenCalled();

    expect(spy).toHaveBeenCalledWith(
      {
        value: 10,
      },
      false
    );

    spy.mockClear();
  });

  it('should silence event', () => {
    const spy = jest.fn();
    const preventDefault = jest.fn();
    const stopPropagation = jest.fn();
    const event = {
      preventDefault,
      stopPropagation,
    };

    silenceEvents(spy)(event);
    expect(preventDefault).toHaveBeenCalled();
    expect(stopPropagation).not.toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
  });
});
