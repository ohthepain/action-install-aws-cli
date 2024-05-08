const { exec } = require('child_process');
const path = require('path');
const { installMacOS } = require('./macOsSupport');
const { toolManager } = require('./toolManager');
const { addPath } = require('@actions/core')
const toolCache = require('@actions/tool-cache');

const IS_WINDOWS = process.platform === 'win32';
const IS_MACOS = process.platform === 'darwin';
const IS_LINUX_ARM = process.platform === 'linux' && process.arch === 'arm';
const IS_LINUX_X64 = process.platform === 'linux' && process.arch === 'x64';

async function isInstalled(toolName) {
  const cachePath = await toolCache.find(toolName, '*');
  const systemPath = await io.which(toolName);
  if (cachePath) return cachePath;
  if (systemPath) {
    return systemPath;
  }
  return false;
}

async function installAwsCliLinuxX64() {
  if (await isInstalled("aws")) {
    return resolve(`AWS CLI is already installed`);
  }

  return new Promise((resolve, reject) => {
    exec('curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && unzip awscliv2.zip && sudo ./aws/install', (error, stdout, stderr) => {
      if (error) {
        reject(`Error installing AWS CLI: ${error.message}`);
      }
      if (stderr) {
        reject(`Error output: ${stderr}`);
      }
      resolve(`AWS CLI installed successfully: ${stdout}`);
    });
  });
}

async function installAwsCliLinuxARM() {
  if (await isInstalled("aws")) {
    return resolve(`AWS CLI is already installed`);
  }

  return new Promise((resolve, reject) => {
    exec('curl "https://awscli.amazonaws.com/awscli-exe-linux-aarch64.zip" -o "awscliv2.zip" && unzip awscliv2.zip && sudo ./aws/install', (error, stdout, stderr) => {
      if (error) {
        reject(`Error installing AWS CLI: ${error.message}`);
      }
      if (stderr) {
        reject(`Error output: ${stderr}`);
      }
      resolve(`AWS CLI installed successfully: ${stdout}`);
    });
  });
}

async function installAWSCliWindows() {
  const downloadUrl = 'https://s3.amazonaws.com/aws-cli/AWSCLISetup.exe';
  const tool = new toolManager(downloadUrl)
  const isInstalled = await isInstalled('aws')
  if (typeof isInstalled === 'string') {
    console.log('WARNING: AWS CLI is already installed but we shall continue');
  }

  console.log(`start downloadUrl ${downloadUrl}`);
  let installerPath = await tool.downloadFile();
  console.log(`downloaded windows exe to ${installerPath}`);
  const destDir = 'C:\\PROGRA~1\\Amazon\\AWSCLI';
  const binFile = 'aws.exe';
  const destPath = path.join(destDir, 'bin', binFile);
  // console.log(`destPath ${destPath}`);

  const installArgs = ['/install', '/quiet', '/norestart'];
  await tool.installPackage(installerPath, installArgs);

  const toolCachePath = await tool.cacheTool(destPath);
  addPath(toolCachePath);

  return toolCachePath;
}

async function _installTool() {
  // const time = (new Date()).toTimeString();
  // core.setOutput("time", time);
  // const payload = JSON.stringify(github.context.payload, undefined, 2)
  // console.log(`The event payload: ${payload}`);

  if (IS_MACOS) {
    return await installMacOS();
  } else if (IS_LINUX_ARM) {
    return await installAwsCliLinuxARM();
  } else if (IS_LINUX_X64) {
    return await installAwsCliLinuxX64();
  } else if (IS_WINDOWS) {
    return await installAWSCliWindows();
  } else {
    throw new Error(`Unsupported architecture for this installer action: process.platform: <${process.platform}> process.arch: <${process.arch}>`);
  }
}

module.exports = { _installTool };

_installTool()
