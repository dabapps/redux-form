import readField from '../readField';
const noop = () => null;

describe('readField', () => {
  const blur = jest.fn();
  const change = jest.fn();
  const focus = jest.fn();
  const defaultProps = {
    asyncBlurFields: [],
    blur,
    change,
    focus,
    form: {},
    initialValues: {},
    readonly: false,
    addArrayValue: noop,
    removeArrayValue: noop,
    fields: [],
  };

  const expectField = ({
    field,
    name,
    value,
    dirty,
    touched,
    visited,
    error,
    initialValue,
    readonly,
    checked,
  }) => {
    expect(field).toBeTruthy();
    expect(typeof field).toBe('object');
    expect(field.name).toBe(name);
    expect(field.value).toEqual(value);
    if (readonly) {
      expect(field.onBlur).toBeFalsy();
      expect(field.onChange).toBeFalsy();
      expect(field.onDragStart).toBeFalsy();
      expect(field.onDrop).toBeFalsy();
      expect(field.onFocus).toBeFalsy();
      expect(field.onUpdate).toBeFalsy();
    } else {
      expect(typeof field.onBlur).toBe('function');
      expect(typeof field.onChange).toBe('function');
      expect(typeof field.onDragStart).toBe('function');
      expect(typeof field.onDrop).toBe('function');
      expect(typeof field.onFocus).toBe('function');
      expect(typeof field.onUpdate).toBe('function');
      expect(field.onUpdate).toBe(field.onChange);

      // call blur
      expect(blur.mock.calls.length).toBe(0);
      field.onBlur('newValue');
      expect(blur.mock.calls.length).toBe(1);
      expect(blur).toHaveBeenCalled();
      expect(blur).toHaveBeenCalledWith(name, 'newValue');

      // call change
      expect(change.mock.calls.length).toBe(0);
      field.onChange('newValue');
      expect(change.mock.calls.length).toBe(1);
      expect(change).toHaveBeenCalled();
      expect(change).toHaveBeenCalledWith(name, 'newValue');

      // call focus
      expect(focus.mock.calls.length).toBe(0);
      field.onFocus();
      expect(focus.mock.calls.length).toBe(1);
      expect(focus).toHaveBeenCalled();
    }
    expect(field.initialValue).toBe(initialValue);
    expect(field.error).toBe(error);
    expect(field.valid).toBe(!error);
    expect(field.invalid).toBe(!!error);
    expect(field.dirty).toBe(dirty);
    expect(field.pristine).toBe(!dirty);
    expect(field.touched).toBe(touched);
    expect(field.visited).toBe(visited);
    expect(field.checked).toBe(checked);

    blur.mockClear();
    change.mockClear();
    focus.mockClear();
  };

  it('should initialize a simple field', () => {
    const fields = {};
    readField({}, 'foo', undefined, fields, {}, undefined, false, defaultProps);
    expectField({
      field: fields.foo,
      name: 'foo',
      value: '',
      dirty: false,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: '',
      readonly: false,
    });
  });

  it('should read a simple field', () => {
    const fields = {};
    readField(
      {
        foo: {
          value: 'bar',
        },
      },
      'foo',
      undefined,
      fields,
      {},
      undefined,
      false,
      defaultProps
    );
    expectField({
      field: fields.foo,
      name: 'foo',
      value: 'bar',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: '',
      readonly: false,
    });
  });

  it('should read a simple field with initial values', () => {
    const fields = {};
    readField(
      {
        foo: {
          value: 'bar',
          initial: 'dog',
        },
      },
      'foo',
      undefined,
      fields,
      {},
      undefined,
      false,
      {
        ...defaultProps,
        initialValues: { foo: 'cat' },
      }
    );
    expectField({
      field: fields.foo,
      name: 'foo',
      value: 'bar',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: 'dog', // state.initial should override prop
      readonly: false,
    });
  });

  it('should read a simple field with sync errors', () => {
    const fields = {};
    readField(
      {
        foo: {
          value: 'bar',
        },
      },
      'foo',
      undefined,
      fields,
      {
        foo: 'fooError',
      },
      undefined,
      false,
      defaultProps
    );
    expectField({
      field: fields.foo,
      name: 'foo',
      value: 'bar',
      dirty: true,
      touched: false,
      visited: false,
      error: 'fooError',
      initialValue: '',
      readonly: false,
    });
  });

  it('should set checked for boolean value', () => {
    const fields = {};
    readField(
      {
        foo: {
          value: true,
        },
      },
      'foo',
      undefined,
      fields,
      {},
      undefined,
      false,
      defaultProps
    );
    expectField({
      field: fields.foo,
      name: 'foo',
      value: true,
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: '',
      readonly: false,
      checked: true,
    });
    readField(
      {
        foo: {
          value: false,
        },
      },
      'foo',
      undefined,
      fields,
      {},
      undefined,
      false,
      defaultProps
    );
    expectField({
      field: fields.foo,
      name: 'foo',
      value: false,
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: '',
      readonly: false,
      checked: false,
    });
  });

  it('should update simple fields', () => {
    const fields = {};
    readField(
      {
        foo: {
          value: 'bar',
        },
      },
      'foo',
      undefined,
      fields,
      {},
      undefined,
      false,
      defaultProps
    );
    expectField({
      field: fields.foo,
      name: 'foo',
      value: 'bar',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: '',
      readonly: false,
    });
    const beforeField = fields.foo;
    readField(
      {
        foo: {
          value: 'dog',
        },
      },
      'foo',
      undefined,
      fields,
      {},
      undefined,
      false,
      defaultProps
    );
    expectField({
      field: fields.foo,
      name: 'foo',
      value: 'dog',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: '',
      readonly: false,
    });
    const afterField = fields.foo;
    expect(beforeField).not.toBe(afterField); // field instance should be different
  });

  it('should initialize a nested field', () => {
    const fields = {};
    readField(
      {},
      'foo.baz',
      undefined,
      fields,
      {},
      undefined,
      false,
      defaultProps
    );
    expectField({
      field: fields.foo.baz,
      name: 'foo.baz',
      value: '',
      dirty: false,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: '',
      readonly: false,
    });
  });

  it('should read a nested field', () => {
    const fields = {};
    readField(
      {
        foo: {
          baz: {
            value: 'bar',
          },
        },
      },
      'foo.baz',
      undefined,
      fields,
      {},
      undefined,
      false,
      defaultProps
    );
    expectField({
      field: fields.foo.baz,
      name: 'foo.baz',
      value: 'bar',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: '',
      readonly: false,
    });
  });

  it('should read a nested field with initial value', () => {
    const fields = {};
    readField(
      {
        foo: {
          baz: {
            value: 'bar',
            initial: 'dog',
          },
        },
      },
      'foo.baz',
      undefined,
      fields,
      {},
      undefined,
      false,
      {
        ...defaultProps,
        initialValues: {
          foo: {
            baz: 'cat',
          },
        },
      }
    );
    expectField({
      field: fields.foo.baz,
      name: 'foo.baz',
      value: 'bar',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: 'dog', // state.initial should override prop
      readonly: false,
    });
  });

  it('should read a nested field with sync errors', () => {
    const fields = {};
    readField(
      {
        foo: {
          baz: {
            value: 'bar',
          },
        },
      },
      'foo.baz',
      undefined,
      fields,
      {
        foo: {
          baz: 'bazError',
        },
      },
      undefined,
      false,
      defaultProps
    );
    expectField({
      field: fields.foo.baz,
      name: 'foo.baz',
      value: 'bar',
      dirty: true,
      touched: false,
      visited: false,
      error: 'bazError',
      initialValue: '',
      readonly: false,
    });
  });

  it('should update a nested field', () => {
    const fields = {};
    readField(
      {
        foo: {
          baz: {
            value: 'bar',
          },
        },
      },
      'foo.baz',
      undefined,
      fields,
      {
        foo: {
          baz: 'bazError',
        },
      },
      undefined,
      false,
      defaultProps
    );
    expectField({
      field: fields.foo.baz,
      name: 'foo.baz',
      value: 'bar',
      dirty: true,
      touched: false,
      visited: false,
      error: 'bazError',
      initialValue: '',
      readonly: false,
    });
    const beforeFoo = fields.foo;
    const beforeField = fields.foo.baz;
    readField(
      {
        foo: {
          baz: {
            value: 'barNew',
          },
        },
      },
      'foo.baz',
      undefined,
      fields,
      {
        foo: {
          baz: 'bazError',
        },
      },
      undefined,
      false,
      defaultProps
    );
    expectField({
      field: fields.foo.baz,
      name: 'foo.baz',
      value: 'barNew',
      dirty: true,
      touched: false,
      visited: false,
      error: 'bazError',
      initialValue: '',
      readonly: false,
    });
    const afterFoo = fields.foo;
    const afterField = fields.foo.baz;
    expect(beforeFoo).not.toBe(afterFoo); // field container instance should be same
    expect(beforeField).not.toBe(afterField); // field instance should be different
  });

  it('should initialize an array field', () => {
    const fields = {};
    readField(
      {},
      'foo[]',
      undefined,
      fields,
      {},
      undefined,
      false,
      defaultProps
    );
    expect(Array.isArray(fields.foo)).toBe(true);
    expect(fields.foo[0]).toBe(undefined);
  });

  it('should read an array field', () => {
    const fields = {};
    readField(
      {
        foo: [{ value: 'bar' }, { value: 'baz' }],
      },
      'foo[]',
      undefined,
      fields,
      {},
      undefined,
      false,
      defaultProps
    );
    expectField({
      field: fields.foo[0],
      name: 'foo[0]',
      value: 'bar',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: '',
      readonly: false,
    });
    expectField({
      field: fields.foo[1],
      name: 'foo[1]',
      value: 'baz',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: '',
      readonly: false,
    });
    expect(fields.foo[2]).toBe(undefined);
  });

  it('should read an array field with an initial value', () => {
    const fields = {};
    readField(
      {
        foo: [{ value: 'bar' }, { value: 'baz' }],
      },
      'foo[]',
      undefined,
      fields,
      {},
      undefined,
      false,
      {
        ...defaultProps,
        initialValues: {
          foo: ['cat1', 'cat2'],
        },
      }
    );
    expectField({
      field: fields.foo[0],
      name: 'foo[0]',
      value: 'bar',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: 'cat1',
      readonly: false,
    });
    expectField({
      field: fields.foo[1],
      name: 'foo[1]',
      value: 'baz',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: 'cat2',
      readonly: false,
    });
  });

  it('should read an array field with sync errors', () => {
    const fields = {};
    readField(
      {
        foo: [{ value: 'bar' }, { value: 'baz' }],
      },
      'foo[]',
      undefined,
      fields,
      {
        foo: ['error1', 'error2'],
      },
      undefined,
      false,
      defaultProps
    );
    expectField({
      field: fields.foo[0],
      name: 'foo[0]',
      value: 'bar',
      dirty: true,
      touched: false,
      visited: false,
      error: 'error1',
      initialValue: '',
      readonly: false,
    });
    expectField({
      field: fields.foo[1],
      name: 'foo[1]',
      value: 'baz',
      dirty: true,
      touched: false,
      visited: false,
      error: 'error2',
      initialValue: '',
      readonly: false,
    });
  });

  it('should update an array field', () => {
    const fields = {};
    readField(
      {
        foo: [{ value: 'bar' }, { value: 'baz' }],
      },
      'foo[]',
      undefined,
      fields,
      {
        foo: ['error1', 'error2'],
      },
      undefined,
      false,
      defaultProps
    );
    expectField({
      field: fields.foo[0],
      name: 'foo[0]',
      value: 'bar',
      dirty: true,
      touched: false,
      visited: false,
      error: 'error1',
      initialValue: '',
      readonly: false,
    });
    expectField({
      field: fields.foo[1],
      name: 'foo[1]',
      value: 'baz',
      dirty: true,
      touched: false,
      visited: false,
      error: 'error2',
      initialValue: '',
      readonly: false,
    });
    const beforeArray = fields.foo;
    const before1 = fields.foo[0];
    const before2 = fields.foo[1];
    readField(
      {
        foo: [{ value: 'barNew' }, { value: 'bazNew' }],
      },
      'foo[]',
      undefined,
      fields,
      {
        foo: ['error1', 'error2'],
      },
      undefined,
      false,
      defaultProps
    );
    expectField({
      field: fields.foo[0],
      name: 'foo[0]',
      value: 'barNew',
      dirty: true,
      touched: false,
      visited: false,
      error: 'error1',
      initialValue: '',
      readonly: false,
    });
    expectField({
      field: fields.foo[1],
      name: 'foo[1]',
      value: 'bazNew',
      dirty: true,
      touched: false,
      visited: false,
      error: 'error2',
      initialValue: '',
      readonly: false,
    });
    const afterArray = fields.foo;
    const after1 = fields.foo[0];
    const after2 = fields.foo[1];
    expect(beforeArray).not.toBe(afterArray); // array should be different
    expect(before1).not.toBe(after1); // field instance should be different
    expect(before2).not.toBe(after2); // field instance should be different
  });

  it('should allow an array field to add a value', () => {
    const spy = jest.fn();
    const fields = {};
    readField(
      {
        foo: [{ value: 'bar' }, { value: 'baz' }],
      },
      'foo[]',
      undefined,
      fields,
      {},
      undefined,
      false,
      {
        ...defaultProps,
        addArrayValue: spy,
      }
    );
    fields.foo.addField('rabbit');
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith('foo', 'rabbit', undefined, []);
  });

  it('should allow an array field to add a deeply nested value', () => {
    const spy = jest.fn();
    const fields = {};
    readField(
      {
        foo: [
          {
            bar: [{ baz: 'foo[0].bar[0].baz' }, { baz: 'foo[0].bar[1].baz' }],
          },
          {
            bar: [{ baz: 'foo[1].bar[0].baz' }, { baz: 'foo[1].bar[1].baz' }],
          },
        ],
      },
      'foo[]',
      undefined,
      fields,
      {},
      undefined,
      false,
      {
        ...defaultProps,
        addArrayValue: spy,
        fields: ['foo[].bar[].baz'],
      }
    );
    fields.foo.addField('rabbit');
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith('foo', 'rabbit', undefined, ['bar[].baz']);
  });

  it('should allow an array field to remove a value', () => {
    const spy = jest.fn();
    const fields = {};
    readField(
      {
        foo: [{ value: 'bar' }, { value: 'baz' }],
      },
      'foo[]',
      undefined,
      fields,
      {},
      undefined,
      false,
      {
        ...defaultProps,
        removeArrayValue: spy,
      }
    );
    fields.foo.removeField(1);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith('foo', 1);
  });

  it('should remove array field when it is no longer in the store', () => {
    const fields = {};
    readField(
      {
        foo: [{ value: 'bar' }, { value: 'baz' }],
      },
      'foo[]',
      undefined,
      fields,
      {},
      undefined,
      false,
      defaultProps
    );
    expect(fields.foo.length).toBe(2);
    expect(fields.foo[0].value).toBe('bar');
    expect(fields.foo[1].value).toBe('baz');
    readField(
      {
        foo: [{ value: 'bar' }],
      },
      'foo[]',
      undefined,
      fields,
      {},
      undefined,
      false,
      defaultProps
    );
    expect(fields.foo.length).toBe(1);
    expect(fields.foo[0].value).toBe('bar');
  });

  it('should initialize a mixed field with empty state', () => {
    const fields = {};
    readField(
      {},
      'pig.foo[].dog.cat[].rat',
      undefined,
      fields,
      {},
      undefined,
      false,
      defaultProps
    );
    expect(typeof fields.pig).toBe('object');
    expect(Array.isArray(fields.pig.foo)).toBe(true);
    expect(fields.pig.foo[0]).toBe(undefined);
  });

  it('should read a mixed field', () => {
    const fields = {};
    readField(
      {
        pig: {
          foo: [
            {
              dog: {
                cat: [
                  {
                    rat: {
                      value: 'hello', // that's deep, baby!
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      'pig.foo[].dog.cat[].rat',
      undefined,
      fields,
      {},
      undefined,
      false,
      defaultProps
    );
    expect(typeof fields.pig).toBe('object');
    expect(Array.isArray(fields.pig.foo)).toBe(true);
    expect(typeof fields.pig.foo[0].dog).toBe('object');
    expect(Array.isArray(fields.pig.foo[0].dog.cat)).toBe(true);
    expect(typeof fields.pig.foo[0].dog.cat[0]).toBe('object');
    expect(typeof fields.pig.foo[0].dog.cat[0].rat).toBe('object');
    expectField({
      field: fields.pig.foo[0].dog.cat[0].rat,
      name: 'pig.foo[0].dog.cat[0].rat',
      value: 'hello',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: '',
      readonly: false,
    });
  });

  it('should change complex field instances when updating a mixed field', () => {
    const fields = {};
    readField(
      {
        pig: {
          foo: [
            {
              dog: {
                value: 'hello',
              },
            },
          ],
        },
      },
      'pig.foo[].dog',
      undefined,
      fields,
      {},
      undefined,
      false,
      defaultProps
    );
    expectField({
      field: fields.pig.foo[0].dog,
      name: 'pig.foo[0].dog',
      value: 'hello',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: '',
      readonly: false,
    });
    const beforeArrayField = fields.pig.foo;
    const beforeObjectField = fields.pig.foo[0];

    readField(
      {
        pig: {
          foo: [
            {
              dog: {
                value: 'goodbye',
              },
            },
          ],
        },
      },
      'pig.foo[].dog',
      undefined,
      fields,
      {},
      undefined,
      false,
      defaultProps
    );
    expectField({
      field: fields.pig.foo[0].dog,
      name: 'pig.foo[0].dog',
      value: 'goodbye',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: '',
      readonly: false,
    });
    const afterArrayField = fields.pig.foo;
    const afterObjectField = fields.pig.foo[0];

    expect(beforeArrayField).not.toBe(afterArrayField); // field instance should be different
    expect(beforeObjectField).not.toBe(afterObjectField); // field instance should be different
  });

  it('should read an array field with an initial value', () => {
    const fields = {};
    readField(
      {
        pig: {
          foo: [
            {
              dog: {
                cat: [
                  {
                    rat: {
                      value: 'hello',
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      'pig.foo[].dog.cat[].rat',
      undefined,
      fields,
      {},
      undefined,
      false,
      {
        ...defaultProps,
        initialValues: {
          pig: {
            foo: [
              {
                dog: {
                  cat: [{ rat: 'initVal' }],
                },
              },
            ],
          },
        },
      }
    );
    expectField({
      field: fields.pig.foo[0].dog.cat[0].rat,
      name: 'pig.foo[0].dog.cat[0].rat',
      value: 'hello',
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: 'initVal',
      readonly: false,
    });
  });

  it('should read a mixed field with sync errors', () => {
    const fields = {};
    readField(
      {
        pig: {
          foo: [
            {
              dog: {
                cat: [
                  {
                    rat: {
                      value: 'hello',
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      'pig.foo[].dog.cat[].rat',
      undefined,
      fields,
      {
        pig: {
          foo: [
            {
              dog: {
                cat: [{ rat: 'syncError' }],
              },
            },
          ],
        },
      },
      undefined,
      false,
      defaultProps
    );
    expectField({
      field: fields.pig.foo[0].dog.cat[0].rat,
      name: 'pig.foo[0].dog.cat[0].rat',
      value: 'hello',
      dirty: true,
      touched: false,
      visited: false,
      error: 'syncError',
      initialValue: '',
      readonly: false,
    });
  });

  it('should allow an array value', () => {
    const fields = {};
    readField(
      {
        foo: {
          value: [1, 2],
        },
      },
      'foo',
      undefined,
      fields,
      {},
      undefined,
      false,
      defaultProps
    );
    expectField({
      field: fields.foo,
      name: 'foo',
      value: [1, 2],
      dirty: true,
      touched: false,
      visited: false,
      error: undefined,
      initialValue: '',
      readonly: false,
    });
  });

  it('should not provide mutators when readonly', () => {
    const fields = {};
    readField({}, 'foo', undefined, fields, {}, undefined, false, {
      ...defaultProps,
      readonly: true,
    });
    const field = fields.foo;
    expect(field.onBlur).toBeFalsy();
    expect(field.onChange).toBeFalsy();
    expect(field.onDragStart).toBeFalsy();
    expect(field.onDrop).toBeFalsy();
    expect(field.onFocus).toBeFalsy();
    expect(field.onUpdate).toBeFalsy();
  });
});
