import bindActionData from '../bindActionData';

describe('bindActionData', () => {
  it('should return a function when called with a function', () => {
    expect(bindActionData(() => ({ foo: 'bar' }), { baz: 7 })).toBeTruthy();
    expect(typeof bindActionData(() => ({ foo: 'bar' }), { baz: 7 })).toBe(
      'function'
    );
  });

  it('should add keys when called with a function', () => {
    expect(bindActionData(() => ({ foo: 'bar' }), { baz: 7 })()).toEqual({
      foo: 'bar',
      baz: 7,
    });
  });

  it('should pass along arguments when called with a function', () => {
    const action = bindActionData((data) => ({ foo: data }), { baz: 7 });
    expect(action('dog')).toEqual({
      foo: 'dog',
      baz: 7,
    });
    expect(action('cat')).toEqual({
      foo: 'cat',
      baz: 7,
    });
  });

  it('should return an object when called with an object', () => {
    const actions = bindActionData(
      {
        a: () => ({ foo: 'bar' }),
        b: () => ({ cat: 'ralph' }),
      },
      { baz: 7 }
    );
    expect(actions).toBeTruthy();
    expect(typeof actions).toBe('object');
    expect(Object.keys(actions).length).toBe(2);
    expect(actions.a).toBeTruthy();
    expect(typeof actions.a).toBe('function');
    expect(actions.b).toBeTruthy();
    expect(typeof actions.b).toBe('function');
  });

  it('should add keys when called with an object', () => {
    const actions = bindActionData(
      {
        a: () => ({ foo: 'bar' }),
        b: () => ({ cat: 'ralph' }),
      },
      { baz: 7 }
    );
    expect(actions.a()).toEqual({
      foo: 'bar',
      baz: 7,
    });
    expect(actions.b()).toEqual({
      cat: 'ralph',
      baz: 7,
    });
  });

  it('should pass along arguments when called with an object', () => {
    const actions = bindActionData(
      {
        a: (value) => ({ foo: value }),
        b: (value) => ({ cat: value }),
      },
      { baz: 9 }
    );
    expect(actions.a('dog')).toEqual({
      foo: 'dog',
      baz: 9,
    });
    expect(actions.b('Bob')).toEqual({
      cat: 'Bob',
      baz: 9,
    });
  });
});
