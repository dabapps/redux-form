import ReactDOM from 'react-dom';

// Custom implementation that returns the fibre tree
const renderIntoDocument = (reactElement) => {
  const root = document.createElement('div');

  ReactDOM.render(reactElement, root);

  return root._reactRootContainer._internalRoot.current.child;
};

const findRenderedComponentWithTypeInternal = (fibreNode, type, collected) => {
  if (fibreNode.type === type) {
    collected.push(fibreNode.stateNode);
  }

  if (fibreNode.child) {
    findRenderedComponentWithTypeInternal(fibreNode.child, type, collected);
  }

  return collected;
};

const findRenderedComponentWithType = (fibreNode, type) => {
  const results = findRenderedComponentWithTypeInternal(fibreNode, type, []);

  if (results.length !== 1) {
    const typeName =
      typeof type === 'string'
        ? type
        : type.displayName || type.name || 'Unknown';
    throw new Error(
      `Did not find exactly one match for "${typeName}" (found: ${results.length})`
    );
  }

  return results[0];
};

const TestUtils = {
  renderIntoDocument,
  findRenderedComponentWithType,
  act: ReactDOM.act
};

export default TestUtils;
