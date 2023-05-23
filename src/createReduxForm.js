import createReduxFormConnector from './createReduxFormConnector';
import hoistStatics from 'hoist-non-react-statics';
import invariant from 'invariant';

/**
 * The decorator that is the main API to redux-form
 */
const createReduxForm =
  (isReactNative, React, connect) => {
    const {Component} = React;
    const reduxFormConnector = createReduxFormConnector(isReactNative, React, connect);
    return (config, mapStateToProps, mapDispatchToProps, mergeProps, options) =>
      WrappedComponent => {
        const ReduxFormConnector = reduxFormConnector(WrappedComponent, mapStateToProps, mapDispatchToProps, mergeProps, options);
        const { forwardRef = false } = (options || {});
        const configWithDefaults = {
          overwriteOnInitialValuesChange: true,
          touchOnBlur: true,
          touchOnChange: false,
          destroyOnUnmount: true,
          ...config
        };
        class ConnectedForm extends Component {
          constructor(props) {
            super(props);

            this.handleSubmitPassback = this.handleSubmitPassback.bind(this);
          }

          getWrappedInstance() {
            invariant(forwardRef,
              `To access the wrapped instance, you need to specify ` +
              `{ forwardRef: true } as the fourth argument of the connect() call.`
            );
            return this.refs.wrappedInstance.refs.wrappedInstance.refs.wrappedInstance;
          }

          handleSubmitPassback(submit) {
            this.submit = submit;
          }

          render() {
            if ( forwardRef ) {
              return (<ReduxFormConnector
                {...configWithDefaults}
                {...this.props}
                ref="wrappedInstance"
                submitPassback={this.handleSubmitPassback}/>);
            }
            return (<ReduxFormConnector
              {...configWithDefaults}
              {...this.props}
              submitPassback={this.handleSubmitPassback}/>);
          }
        }
        return hoistStatics(ConnectedForm, WrappedComponent);
      };
  };

export default createReduxForm;
