const { getLocalDir } = require('../src/util');
const tempPath = getLocalDir('temp');
const cachePath = getLocalDir('tools');

// @actions/tool-cache plays with these on load - force them for testing
process.env['RUNNER_TEMP'] = tempPath;
process.env['RUNNER_TOOL_CACHE'] = cachePath;

const { rmRF } = require('@actions/io');
const { cacheFile, downloadTool, find } = require('@actions/tool-cache');
const nock = require('nock');
const { _installTool } = require('../src/index');
const { _filterVersion } = require('../src/util');

function setupTest() {
  beforeAll(function () {
    nock('http://example.com')
      .persist()
      .get('/bytes/35')
      .reply(200);
  });
  beforeEach(async function () {
    await rmRF(cachePath);
    await rmRF(tempPath);
  });
  // afterAll(async function () {
  //   await rmRF(tempPath)
  //   await rmRF(cachePath)
  // })
}

describe('Test End to End', () => {
  setupTest();
  const installTimeoutMsec = 300000;
  it('Will download, cache and return aws-cli', async () => {
    jest.setTimeout(installTimeoutMsec);
    const toolPath = await _installTool();
    expect(toolPath).toContain('aws');
  }, installTimeout);
});
