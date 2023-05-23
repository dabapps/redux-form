import wrapMapDispatchToProps from '../wrapMapDispatchToProps';

describe('wrapMapDispatchToProps', () => {
  it('should bind action creators if no mapDispatchToProps given', () => {
    const actionCreators = {
      a: jest.fn(),
      b: jest.fn()
    };
    const result = wrapMapDispatchToProps(undefined, actionCreators);
    expect(typeof result).toBe('function');
    expect(result.length).toBe(1);
    const dispatch = jest.fn();
    const mapped = result(dispatch);
    expect(typeof mapped).toBe('object');
    expect(typeof mapped.a).toBe('function');
    expect(typeof mapped.b).toBe('function');

    mapped.a('foo');
    expect(actionCreators.a).toHaveBeenCalled();
    expect(actionCreators.a).toHaveBeenCalledWith('foo');
    expect(dispatch).toHaveBeenCalled();
    dispatch.mockClear();
    mapped.b();
    expect(actionCreators.b).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalled();
  });

  it('should bind action creators if object mapDispatchToProps given', () => {
    const actionCreators = {
      a: jest.fn(),
      b: jest.fn()
    };
    const mapDispatchToProps = {
      c: jest.fn(),
      d: jest.fn()
    };
    const result = wrapMapDispatchToProps(mapDispatchToProps, actionCreators);
    expect(typeof result).toBe('function');
    expect(result.length).toBe(1);
    const dispatch = jest.fn();
    const mapped = result(dispatch);
    expect(typeof mapped).toBe('object');
    expect(typeof mapped.a).toBe('function');
    expect(typeof mapped.b).toBe('function');
    expect(typeof mapped.c).toBe('function');
    expect(typeof mapped.d).toBe('function');

    mapped.a('foo');
    expect(actionCreators.a).toHaveBeenCalled();
    expect(actionCreators.a).toHaveBeenCalledWith('foo');
    expect(dispatch).toHaveBeenCalled();
    dispatch.mockClear();
    mapped.b();
    expect(actionCreators.b).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalled();
    dispatch.mockClear();
    mapped.c('bar');
    expect(mapDispatchToProps.c).toHaveBeenCalled();
    expect(mapDispatchToProps.c).toHaveBeenCalledWith('bar');
    expect(dispatch).toHaveBeenCalled();
    dispatch.mockClear();
    mapped.d();
    expect(mapDispatchToProps.d).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalled();
  });

  it('should call mapDispatchToProps when one-param function given', () => {
    const actionCreators = {
      a: jest.fn(),
      b: jest.fn()
    };
    const mapDispatchToPropsSpy = jest.fn().mockImplementation(() => ({
      c: 42,
      d: true
    }));
    const mapDispatchToProps = dispatch => mapDispatchToPropsSpy(dispatch);
    expect(mapDispatchToProps.length).toBe(1);

    const result = wrapMapDispatchToProps(mapDispatchToProps, actionCreators);
    expect(typeof result).toBe('function');
    expect(result.length).toBe(1);
    const dispatch = jest.fn();
    const mapped = result(dispatch);
    expect(mapDispatchToPropsSpy).toHaveBeenCalled();
    expect(mapDispatchToPropsSpy).toHaveBeenCalledWith(dispatch);

    expect(typeof mapped).toBe('object');
    expect(typeof mapped.a).toBe('function');
    expect(typeof mapped.b).toBe('function');
    expect(mapped.c).toBe(42);
    expect(mapped.d).toBe(true);

    mapped.a('foo');
    expect(actionCreators.a).toHaveBeenCalled();
    expect(actionCreators.a).toHaveBeenCalledWith('foo');
    expect(dispatch).toHaveBeenCalled();
    dispatch.mockClear();
    mapped.b();
    expect(actionCreators.b).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalled();
  });

  it('should call mapDispatchToProps when two-param function given', () => {
    const actionCreators = {
      a: jest.fn(),
      b: jest.fn()
    };
    const mapDispatchToPropsSpy = jest.fn().mockImplementation(() => ({
      c: 42,
      d: true
    }));
    const mapDispatchToProps = (dispatch, ownProps) => mapDispatchToPropsSpy(dispatch, ownProps);
    expect(mapDispatchToProps.length).toBe(2);

    const result = wrapMapDispatchToProps(mapDispatchToProps, actionCreators);
    expect(typeof result).toBe('function');
    expect(result.length).toBe(2);
    const dispatch = jest.fn();
    const mapped = result(dispatch, 75);
    expect(mapDispatchToPropsSpy).toHaveBeenCalled();
    expect(mapDispatchToPropsSpy).toHaveBeenCalledWith(dispatch, 75);

    expect(typeof mapped).toBe('object');
    expect(typeof mapped.a).toBe('function');
    expect(typeof mapped.b).toBe('function');
    expect(mapped.c).toBe(42);
    expect(mapped.d).toBe(true);

    mapped.a('foo');
    expect(actionCreators.a).toHaveBeenCalled();
    expect(actionCreators.a).toHaveBeenCalledWith('foo');
    expect(dispatch).toHaveBeenCalled();
    dispatch.mockClear();
    mapped.b();
    expect(actionCreators.b).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalled();
  });
});
