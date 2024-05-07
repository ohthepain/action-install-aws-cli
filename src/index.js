const { exec } = require('child_process');
const path = require('path');
const { installMacOS } = require('./macOsSupport');
const toolManager = require('./toolManager');

const IS_WINDOWS = process.platform === 'win32';
const IS_MACOS = process.platform === 'darwin';
const IS_LINUX_ARM = process.platform === 'linux' && process.arch === 'arm';
const IS_LINUX_X64 = process.platform === 'linux' && process.arch === 'x64';

function installAwsCliLinuxX64() {
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

function installAwsCliLinuxARM() {
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
  const isInstalled = await tool.isAlreadyInstalled('aws')
  if (typeof isInstalled === 'string') {
    console.log('WARNING: AWS CLI is already installed but we shall continue');
    // TODO: Figure out what is best to do when already found
    // return isInstalled
  }

  console.log(`start downloadUrl ${downloadUrl}`);
  let installerPath = await tool.downloadFile();
  console.log(`downloaded windows exe to ${installerPath}`);
  const destDir = 'C:\\PROGRA~1\\Amazon\\AWSCLI';
  const binFile = 'aws.exe';
  const destPath = path.join(destDir, 'bin', binFile);
  console.log(`destPath ${destPath}`);

  const installArgs = ['/install', '/quiet', '/norestart'];
  await tool.installPackage(installerPath, installArgs);
  console.log(`installed package`);

  const toolCachePath = await tool.cacheTool(destPath);
  addPath(toolCachePath);
  console.log(`added path toolCachePath ${toolCachePath}`);

  return toolCachePath;
}

async function _installTool() {
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

_installTool()

module.exports = { _installTool };
