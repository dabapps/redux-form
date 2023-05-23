import isPromise from 'is-promise';
import handleSubmit from '../handleSubmit';

describe('handleSubmit', () => {

  it('should stop if sync validation fails', () => {
    const values = {foo: 'bar', baz: 42};
    const fields = ['foo', 'baz'];
    const submit = jest.fn().mockImplementation(() => 69);
    const touch = jest.fn();
    const startSubmit = jest.fn();
    const stopSubmit = jest.fn();
    const submitFailed = jest.fn();
    const onSubmitSuccess = jest.fn();
    const onSubmitFail = jest.fn();
    const asyncValidate = jest.fn();
    const validate = jest.fn().mockImplementation(() => ({
      foo: 'error'
    }));
    const props = {
      fields, onSubmitSuccess, onSubmitFail, startSubmit, stopSubmit,
      submitFailed, touch, validate
    };

    expect(handleSubmit(submit, values, props, asyncValidate)).toBe(undefined);

    expect(touch).toHaveBeenCalled();
    expect(touch).toHaveBeenCalledWith(...fields);
    expect(validate).toHaveBeenCalled();
    expect(validate).toHaveBeenCalledWith(values, props);
    expect(asyncValidate).not.toHaveBeenCalled();
    expect(submit).not.toHaveBeenCalled();
    expect(startSubmit).not.toHaveBeenCalled();
    expect(stopSubmit).not.toHaveBeenCalled();
    expect(submitFailed).toHaveBeenCalled();
    expect(onSubmitSuccess).not.toHaveBeenCalled();
    expect(onSubmitFail).toHaveBeenCalled();
  });

  it('should stop and return rejected promise if sync validation fails and returnRejectedSubmitPromise', (done) => {
    const values = {foo: 'bar', baz: 42};
    const fields = ['foo', 'baz'];
    const errorValue = {foo: 'error'};
    const submit = jest.fn().mockImplementation(() => 69);
    const touch = jest.fn();
    const startSubmit = jest.fn();
    const stopSubmit = jest.fn();
    const submitFailed = jest.fn();
    const onSubmitSuccess = jest.fn();
    const onSubmitFail = jest.fn();
    const asyncValidate = jest.fn();
    const validate = jest.fn().mockImplementation(() => errorValue);
    const props = {
      fields, onSubmitSuccess, onSubmitFail, startSubmit, stopSubmit,
      submitFailed, touch, validate, returnRejectedSubmitPromise: true
    };

    const result = handleSubmit(submit, values, props, asyncValidate);
    expect(isPromise(result)).toBe(true);

    expect(touch).toHaveBeenCalled();
    expect(touch).toHaveBeenCalledWith(...fields);
    expect(validate).toHaveBeenCalled();
    expect(validate).toHaveBeenCalledWith(values, props);
    expect(asyncValidate).not.toHaveBeenCalled();
    expect(submit).not.toHaveBeenCalled();
    expect(startSubmit).not.toHaveBeenCalled();
    expect(stopSubmit).not.toHaveBeenCalled();
    expect(submitFailed).toHaveBeenCalled();
    expect(onSubmitSuccess).not.toHaveBeenCalled();
    expect(onSubmitFail).toHaveBeenCalled();
    result.then(() => {
      expect(false).toBe(true); // should not be in resolve branch
    }, (error) => {
      expect(error).toBe(errorValue);
      done();
    });
  });

  it('should return result of sync submit', () => {
    const values = {foo: 'bar', baz: 42};
    const fields = ['foo', 'baz'];
    const submit = jest.fn().mockImplementation(() => 69);
    const dispatch = () => null;
    const touch = jest.fn();
    const startSubmit = jest.fn();
    const stopSubmit = jest.fn();
    const submitFailed = jest.fn();
    const onSubmitSuccess = jest.fn();
    const onSubmitFail = jest.fn();
    const asyncValidate = jest.fn();
    const validate = jest.fn().mockImplementation(() => ({}));
    const props = {
      dispatch, fields, onSubmitSuccess, onSubmitFail, startSubmit, stopSubmit,
      submitFailed, touch, validate
    };

    expect(handleSubmit(submit, values, props, asyncValidate)).toBe(69);

    expect(touch).toHaveBeenCalled();
    expect(touch).toHaveBeenCalledWith(...fields);
    expect(validate).toHaveBeenCalled();
    expect(validate).toHaveBeenCalledWith(values, props);
    expect(asyncValidate).toHaveBeenCalled();
    expect(asyncValidate).toHaveBeenCalledWith();
    expect(submit).toHaveBeenCalled();
    expect(submit).toHaveBeenCalledWith(values, dispatch, props);
    expect(startSubmit).not.toHaveBeenCalled();
    expect(stopSubmit).not.toHaveBeenCalled();
    expect(submitFailed).not.toHaveBeenCalled();
    expect(onSubmitSuccess).toHaveBeenCalled();
    expect(onSubmitFail).not.toHaveBeenCalled();
  });

  it('should not submit if async validation fails', () => {
    const values = {foo: 'bar', baz: 42};
    const fields = ['foo', 'baz'];
    const submit = jest.fn().mockImplementation(() => 69);
    const dispatch = () => null;
    const touch = jest.fn();
    const startSubmit = jest.fn();
    const stopSubmit = jest.fn();
    const submitFailed = jest.fn();
    const onSubmitSuccess = jest.fn();
    const onSubmitFail = jest.fn();
    const asyncValidate = jest.fn().mockImplementation(() => Promise.reject());
    const validate = jest.fn().mockImplementation(() => ({}));
    const props = {
      dispatch, fields, onSubmitSuccess, onSubmitFail, startSubmit, stopSubmit,
      submitFailed, touch, validate
    };

    return handleSubmit(submit, values, props, asyncValidate)
      .then(result => {
        expect(result).toBe(undefined);
        expect(touch).toHaveBeenCalled();
        expect(touch).toHaveBeenCalledWith(...fields);
        expect(validate).toHaveBeenCalled();
        expect(validate).toHaveBeenCalledWith(values, props);
        expect(asyncValidate).toHaveBeenCalled();
        expect(asyncValidate).toHaveBeenCalledWith();
        expect(submit).not.toHaveBeenCalled();
        expect(startSubmit).not.toHaveBeenCalled();
        expect(stopSubmit).not.toHaveBeenCalled();
        expect(submitFailed).toHaveBeenCalled();
        expect(onSubmitSuccess).not.toHaveBeenCalled();
        expect(onSubmitFail).toHaveBeenCalled();
      }, () => {
        expect(false).toBe(true); // should not get into reject branch
      });
  });

  it('should not submit if async validation fails and return rejected promise', () => {
    const values = {foo: 'bar', baz: 42};
    const fields = ['foo', 'baz'];
    const submit = jest.fn().mockImplementation(() => 69);
    const dispatch = () => null;
    const touch = jest.fn();
    const startSubmit = jest.fn();
    const stopSubmit = jest.fn();
    const submitFailed = jest.fn();
    const onSubmitSuccess = jest.fn();
    const onSubmitFail = jest.fn();
    const asyncValidate = jest.fn().mockImplementation(() => Promise.reject());
    const validate = jest.fn().mockImplementation(() => ({}));
    const props = {
      dispatch, fields, onSubmitSuccess, onSubmitFail, startSubmit, stopSubmit,
      submitFailed, touch, validate, returnRejectedSubmitPromise: true
    };

    return handleSubmit(submit, values, props, asyncValidate)
      .then(() => {
        expect(false).toBe(true); // should not get into resolve branch
      }, result => {
        expect(result).toBe(undefined);
        expect(touch).toHaveBeenCalled();
        expect(touch).toHaveBeenCalledWith(...fields);
        expect(validate).toHaveBeenCalled();
        expect(validate).toHaveBeenCalledWith(values, props);
        expect(asyncValidate).toHaveBeenCalled();
        expect(asyncValidate).toHaveBeenCalledWith();
        expect(submit).not.toHaveBeenCalled();
        expect(startSubmit).not.toHaveBeenCalled();
        expect(stopSubmit).not.toHaveBeenCalled();
        expect(submitFailed).toHaveBeenCalled();
        expect(onSubmitSuccess).not.toHaveBeenCalled();
        expect(onSubmitFail).toHaveBeenCalled();
      });
  });

  it('should sync submit if async validation passes', () => {
    const values = {foo: 'bar', baz: 42};
    const fields = ['foo', 'baz'];
    const submit = jest.fn().mockImplementation(() => 69);
    const dispatch = () => null;
    const touch = jest.fn();
    const startSubmit = jest.fn();
    const stopSubmit = jest.fn();
    const submitFailed = jest.fn();
    const onSubmitSuccess = jest.fn();
    const onSubmitFail = jest.fn();
    const asyncValidate = jest.fn().mockImplementation(() => Promise.resolve());
    const validate = jest.fn().mockImplementation(() => ({}));
    const props = {
      dispatch, fields, onSubmitSuccess, onSubmitFail, startSubmit, stopSubmit,
      submitFailed, touch, validate
    };

    return handleSubmit(submit, values, props, asyncValidate)
      .then(result => {
        expect(result).toBe(69);
        expect(touch).toHaveBeenCalled();
        expect(touch).toHaveBeenCalledWith(...fields);
        expect(validate).toHaveBeenCalled();
        expect(validate).toHaveBeenCalledWith(values, props);
        expect(asyncValidate).toHaveBeenCalled();
        expect(asyncValidate).toHaveBeenCalledWith();
        expect(submit).toHaveBeenCalled();
        expect(submit).toHaveBeenCalledWith(values, dispatch, props);
        expect(startSubmit).not.toHaveBeenCalled();
        expect(stopSubmit).not.toHaveBeenCalled();
        expect(submitFailed).not.toHaveBeenCalled();
        expect(onSubmitSuccess).toHaveBeenCalled();
        expect(onSubmitFail).not.toHaveBeenCalled();
      }, () => {
        expect(false).toBe(true); // should not get into reject branch
      });
  });

  it('should async submit if async validation passes', () => {
    const values = {foo: 'bar', baz: 42};
    const fields = ['foo', 'baz'];
    const submit = jest.fn().mockImplementation(() => Promise.resolve(69));
    const dispatch = () => null;
    const touch = jest.fn();
    const startSubmit = jest.fn();
    const stopSubmit = jest.fn();
    const submitFailed = jest.fn();
    const onSubmitSuccess = jest.fn();
    const onSubmitFail = jest.fn();
    const asyncValidate = jest.fn().mockImplementation(() => Promise.resolve());
    const validate = jest.fn().mockImplementation(() => ({}));
    const props = {
      dispatch, fields, onSubmitSuccess, onSubmitFail, startSubmit, stopSubmit,
      submitFailed, touch, validate
    };

    return handleSubmit(submit, values, props, asyncValidate)
      .then(result => {
        expect(result).toBe(69);
        expect(touch).toHaveBeenCalled();
        expect(touch).toHaveBeenCalledWith(...fields);
        expect(validate).toHaveBeenCalled();
        expect(validate).toHaveBeenCalledWith(values, props);
        expect(asyncValidate).toHaveBeenCalled();
        expect(asyncValidate).toHaveBeenCalledWith();
        expect(submit).toHaveBeenCalled();
        expect(submit).toHaveBeenCalledWith(values, dispatch, props);
        expect(startSubmit).toHaveBeenCalled();
        expect(stopSubmit).toHaveBeenCalled();
        expect(stopSubmit).toHaveBeenCalledWith();
        expect(submitFailed).not.toHaveBeenCalled();
        expect(onSubmitSuccess).toHaveBeenCalled();
        expect(onSubmitFail).not.toHaveBeenCalled();
      }, () => {
        expect(false).toBe(true); // should not get into reject branch
      });
  });

  it('should set submit errors if async submit fails', () => {
    const values = {foo: 'bar', baz: 42};
    const fields = ['foo', 'baz'];
    const submitErrors = {foo: 'error'};
    const submit = jest.fn().mockImplementation(() => Promise.reject(submitErrors));
    const dispatch = () => null;
    const touch = jest.fn();
    const startSubmit = jest.fn();
    const stopSubmit = jest.fn();
    const submitFailed = jest.fn();
    const onSubmitSuccess = jest.fn();
    const onSubmitFail = jest.fn();
    const asyncValidate = jest.fn().mockImplementation(() => Promise.resolve());
    const validate = jest.fn().mockImplementation(() => ({}));
    const props = {
      dispatch, fields, onSubmitSuccess, onSubmitFail, startSubmit, stopSubmit,
      submitFailed, touch, validate
    };

    return handleSubmit(submit, values, props, asyncValidate)
      .then(result => {
        expect(result).toBe(undefined);
        expect(touch).toHaveBeenCalled();
        expect(touch).toHaveBeenCalledWith(...fields);
        expect(validate).toHaveBeenCalled();
        expect(validate).toHaveBeenCalledWith(values, props);
        expect(asyncValidate).toHaveBeenCalled();
        expect(asyncValidate).toHaveBeenCalledWith();
        expect(submit).toHaveBeenCalled();
        expect(submit).toHaveBeenCalledWith(values, dispatch, props);
        expect(startSubmit).toHaveBeenCalled();
        expect(stopSubmit).toHaveBeenCalled();
        expect(stopSubmit).toHaveBeenCalledWith(submitErrors);
        expect(submitFailed).not.toHaveBeenCalled();
        expect(onSubmitSuccess).not.toHaveBeenCalled();
        expect(onSubmitFail).toHaveBeenCalled();
        expect(onSubmitFail).toHaveBeenCalledWith(submitErrors);
      }, () => {
        expect(false).toBe(true); // should not get into reject branch
      });
  });

  it('should set submit errors if async submit fails and return rejected promise', () => {
    const values = {foo: 'bar', baz: 42};
    const fields = ['foo', 'baz'];
    const submitErrors = {foo: 'error'};
    const submit = jest.fn().mockImplementation(() => Promise.reject(submitErrors));
    const dispatch = () => null;
    const touch = jest.fn();
    const startSubmit = jest.fn();
    const stopSubmit = jest.fn();
    const submitFailed = jest.fn();
    const onSubmitSuccess = jest.fn();
    const onSubmitFail = jest.fn();
    const asyncValidate = jest.fn().mockImplementation(() => Promise.resolve());
    const validate = jest.fn().mockImplementation(() => ({}));
    const props = {
      dispatch, fields, onSubmitSuccess, onSubmitFail, startSubmit, stopSubmit,
      submitFailed, touch, validate, returnRejectedSubmitPromise: true
    };

    return handleSubmit(submit, values, props, asyncValidate)
      .then(() => {
        expect(false).toBe(true); // should not get into resolve branch
      }, result => {
        expect(result).toBe(submitErrors);
        expect(touch).toHaveBeenCalled();
        expect(touch).toHaveBeenCalledWith(...fields);
        expect(validate).toHaveBeenCalled();
        expect(validate).toHaveBeenCalledWith(values, props);
        expect(asyncValidate).toHaveBeenCalled();
        expect(asyncValidate).toHaveBeenCalledWith();
        expect(submit).toHaveBeenCalled();
        expect(submit).toHaveBeenCalledWith(values, dispatch, props);
        expect(startSubmit).toHaveBeenCalled();
        expect(stopSubmit).toHaveBeenCalled();
        expect(stopSubmit).toHaveBeenCalledWith(submitErrors);
        expect(submitFailed).not.toHaveBeenCalled();
        expect(onSubmitSuccess).not.toHaveBeenCalled();
        expect(onSubmitFail).toHaveBeenCalled();
        expect(onSubmitFail).toHaveBeenCalledWith(submitErrors);
      });
  });
});
