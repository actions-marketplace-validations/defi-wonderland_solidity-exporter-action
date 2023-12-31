import { expect } from 'chai';
import { transformRemappings } from '../../src/transformRemappings';
import mock from 'mock-fs';

describe('transformRemappings', () => {
  before(() => {
    mock({
      'remappings.txt': 'interfaces=../../interfaces',
    });
  });

  after(() => {
    mock.restore();
  });

  it('should transform imports with remappings', () => {
    const fileContent = `
        import '../../../interfaces/ITest.sol';
        import './someFile.sol';
      `;

    const transformedContent = transformRemappings(fileContent);

    expect(transformedContent).to.include(`import '../../../../../interfaces/ITest.sol';`);
    expect(transformedContent).to.include(`import './someFile.sol';`);
  });

  it('should handle imports from node_modules correctly', () => {
    const fileContent = `
      import '../../../node_modules/some-package/Contract.sol';
      import 'node_modules/another-package/Token.sol';
    `;

    const transformedContent = transformRemappings(fileContent);

    expect(transformedContent).to.include(`import 'some-package/Contract.sol';`);
    expect(transformedContent).to.include(`import 'another-package/Token.sol';`);
  });
});
