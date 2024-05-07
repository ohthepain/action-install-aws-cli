const { _installTool } = require('../src/index');

describe('Test end-to-end', () => {
  const installTimeoutMsec = 600000;
  it('Install test', async () => {
    jest.setTimeout(installTimeoutMsec);
    const toolPath = await _installTool();
    console.log(`toolPath: ${toolPath}`);
    expect(toolPath.toLowerCase()).toContain('aws');
  }, installTimeoutMsec);
});
