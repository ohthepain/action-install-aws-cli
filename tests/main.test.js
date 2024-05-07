// const { getLocalDir } = require('../src/util');
// const tempPath = getLocalDir('temp');
// const cachePath = getLocalDir('tools');

// @actions/tool-cache plays with these on load - force them for testing
// process.env['RUNNER_TEMP'] = tempPath;
// process.env['RUNNER_TOOL_CACHE'] = cachePath;

// const { rmRF } = require('@actions/io');
const { _installTool } = require('../src/index');

describe('Test End to End', () => {
  const installTimeoutMsec = 600000;
  it('Will download, cache and return aws-cli', async () => {
    jest.setTimeout(installTimeoutMsec);
    const toolPath = await _installTool();
    console.log(`toolPath: ${toolPath}`);
    expect(toolPath.toLowerCase()).toContain('aws');
  }, installTimeoutMsec);
});
