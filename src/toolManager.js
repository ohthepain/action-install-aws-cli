const { exec } = require('@actions/exec');
const core = require('@actions/core');
const tc = require('@actions/tool-cache');
const io = require('@actions/io');
const path = require('path');
const { _filterVersion, _readFile } = require('./util');

const IS_WINDOWS = process.platform === 'win32';

class toolManager {
  constructor(downloadUrl) {
    this.downloadUrl = downloadUrl;
    this.fileType = this.downloadUrl.substr(-4);
  }

  async isAlreadyInstalled(toolName) {
    const cachePath = await tc.find(toolName, '*');
    const systemPath = await io.which(toolName);
    if (cachePath) return cachePath;
    if (systemPath) {
      return systemPath;
    }
    return false;
  }

  async _getVersion(installedBinary) {
    const versionCommandOutput = await this._getCommandOutput(installedBinary, ['--version']);
    const installedVersion = _filterVersion(versionCommandOutput);
    return installedVersion;
  }

  async _getCommandOutput(commandStr, args) {
    let stdErr = '';
    let stdOut = '';
    const options = {
      windowsVerbatimArguments: false,
      listeners: {
        stderr: (data) => {
          stdErr += data.toString();
        },
        stdout: (data) => {
          stdOut += data.toString();
        }
      }
    };

    if (IS_WINDOWS) {
      const logFile = path.join(__dirname, 'log.txt');
      args.push('>', logFile);
      args.unshift(commandStr);
      args.unshift('/c');
      commandStr = 'cmd';
      await exec(commandStr, args, options);
      return await _readFile(logFile, {});
    } else {
      await exec(commandStr, args, options);
      if (stdOut === '') return stdErr;
      return stdOut;
    }
  }

  async downloadFile() {
    const filePath = await tc.downloadTool(this.downloadUrl);
    const destPath = `${filePath}${this.fileType}`;
    // console.log(`toolManager: start download of ${filePath} to ${destPath}`);
    await io.mv(filePath, destPath);
    // console.log(`toolManager: dunn`);
    return destPath;
  }

  async extractFile(filePath) {
    const extractDir = path.dirname(filePath);
    if (process.platform === 'linux') {
      await exec(`unzip ${filePath}`, ['-d', extractDir]);
      return extractDir;
    }
    return await tc.extractZip(filePath, extractDir);
  }

  async installPackage(installCommand, installArgs) {
    return await exec(installCommand, installArgs);
  }

  async cacheTool(installedBinary) {
    const installedVersion = await this._getVersion(installedBinary);
    const cachedPath = await tc.cacheDir(path.parse(installedBinary).dir, 'aws', installedVersion);
    return cachedPath;
  }
}

module.exports = { toolManager };
