import wrapMapStateToProps from '../wrapMapStateToProps';

describe('wrapMapStateToProps', () => {
  it('should save form if no mapStateToProps given', () => {
    const getForm = jest.fn().mockImplementation(() => 'foo');
    const result = wrapMapStateToProps(undefined, getForm);
    expect(typeof result).toBe('function');
    expect(result.length).toBe(1);
    const mapped = result('bar');
    expect(getForm).toHaveBeenCalled();
    expect(getForm).toHaveBeenCalledWith('bar');
    expect(mapped).toEqual({form: 'foo'});
  });

  it('should throw error when mapStateToProps is not a function', () => {
    const getForm = jest.fn();
    expect(() => wrapMapStateToProps(true, getForm)).toThrow('mapStateToProps must be a function');
    expect(() => wrapMapStateToProps(42, getForm)).toThrow('mapStateToProps must be a function');
    expect(() => wrapMapStateToProps({}, getForm)).toThrow('mapStateToProps must be a function');
    expect(() => wrapMapStateToProps([], getForm)).toThrow('mapStateToProps must be a function');
    expect(getForm).not.toHaveBeenCalled();
  });

  it('should call mapStateToProps when one-param function given', () => {
    const getForm = jest.fn().mockImplementation(() => 'foo');
    const mapStateToPropsSpy = jest.fn().mockImplementation(() => ({
      a: 42,
      b: true,
      c: 'baz'
    }));
    const mapStateToProps = state => mapStateToPropsSpy(state);
    expect(mapStateToProps.length).toBe(1);

    const result = wrapMapStateToProps(mapStateToProps, getForm);
    expect(typeof result).toBe('function');
    expect(result.length).toBe(1);
    const mapped = result('bar');
    expect(mapStateToPropsSpy).toHaveBeenCalled();
    expect(mapStateToPropsSpy).toHaveBeenCalledWith('bar');
    expect(getForm).toHaveBeenCalled();
    expect(getForm).toHaveBeenCalledWith('bar');

    expect(mapped).toEqual({
      a: 42,
      b: true,
      c: 'baz',
      form: 'foo'
    });
  });

  it('should call mapStateToProps when two-param function given', () => {
    const getForm = jest.fn().mockImplementation(() => 'foo');
    const mapStateToPropsSpy = jest.fn().mockImplementation(() => ({
      a: 42,
      b: true,
      c: 'baz'
    }));
    const mapStateToProps = (state, ownProps) => mapStateToPropsSpy(state, ownProps);
    expect(mapStateToProps.length).toBe(2);

    const result = wrapMapStateToProps(mapStateToProps, getForm);
    expect(typeof result).toBe('function');
    expect(result.length).toBe(2);
    const mapped = result('bar', 'dog');
    expect(mapStateToPropsSpy).toHaveBeenCalled();
    expect(mapStateToPropsSpy).toHaveBeenCalledWith('bar', 'dog');
    expect(getForm).toHaveBeenCalled();
    expect(getForm).toHaveBeenCalledWith('bar');

    expect(mapped).toEqual({
      a: 42,
      b: true,
      c: 'baz',
      form: 'foo'
    });
  });
});
