

import { addPath } from '@actions/core/lib/core'
import { DownloadExtractInstall } from './toolHandler'
import * as path from 'path'

import { installMacOS } from './macOsSupport'

const IS_WINDOWS: boolean = process.platform === 'win32' ? true : false
const IS_MACOS: boolean = process.platform === 'darwin' ? true : false
const IS_LINUX_ARM: boolean = (process.platform === 'darwin' && process.arch === 'arm') ? true : false
const IS_LINUX_X64: boolean = (process.platform === 'darwin' && process.arch !== 'arm') ? true : false

const { exec } = require('child_process');

// Windows https://awscli.amazonaws.com/AWSCLIV2.msi
// MacOS https://awscli.amazonaws.com/AWSCLIV2.pkg
// Linux https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2-linux.html#cliv2-linux-install

function installAwsCliLinuxX64() : Promise<string> {
  return new Promise((resolve, reject) => {
      exec('curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && unzip awscliv2.zip && sudo ./aws/install', (error: { message: any; }, stdout: any, stderr: any) => {
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

function installAwsCliLinuxARM() : Promise<string> {
  return new Promise((resolve, reject) => {
      exec('curl "https://awscli.amazonaws.com/awscli-exe-linux-aarch64.zip" -o "awscliv2.zip" && unzip awscliv2.zip && sudo ./aws/install', (error: { message: any; }, stdout: any, stderr: any) => {
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

async function installAWSCliWindows() : Promise<string> {
  const downloadUrl = 'https://s3.amazonaws.com/aws-cli/AWSCLISetup.exe';
  const tool = new DownloadExtractInstall(downloadUrl)

  const isInstalled = await tool.isAlreadyInstalled('aws')
  if(typeof isInstalled === 'string') {
    console.log('WARNING: AWS CLI is already installed but we shall continue')
    // TODO Figure out what is best to do when already found
    // return isInstalled
  }

  let installerPath = await tool.downloadFile();
  console.log(`downloaded windows exe to ${installerPath}`);
  const destDir = 'C:\\PROGRA~1\\Amazon\\AWSCLI'
  const binFile = 'aws.exe';
  const destPath = path.join(destDir, 'bin', binFile);
  console.log(`destPath ${destPath}`)

  const installArgs: string[] = ['/install', '/quiet', '/norestart'];
  await tool.installPackage(installerPath, installArgs)
  console.log(`installed package`)

  const toolCachePath = await tool.cacheTool(destPath)
  addPath(toolCachePath)
  console.log(`added path toolCachePath ${toolCachePath}`)

  return toolCachePath
}


export async function _installTool(): Promise<string>{
  // return installAWSCLI();

  if (IS_MACOS) {
    return await installMacOS()
  } else if (IS_LINUX_ARM) {
    return await installAwsCliLinuxARM();
  } else if (IS_LINUX_X64) {
    return await installAwsCliLinuxX64();
  } else if (IS_WINDOWS) {
    return await installAWSCliWindows();
  } else {
    throw new Error(`Unsupported architecture for this installer action: process.platform: <${process.platform}> process.arch: <${process.arch}>`)
  }
  
  // const downloadUrl = IS_WINDOWS ? 'https://s3.amazonaws.com/aws-cli/AWSCLISetup.exe' : 'https://s3.amazonaws.com/aws-cli/awscli-bundle.zip'
  // const tool = new DownloadExtractInstall(downloadUrl)

  // const isInstalled = await tool.isAlreadyInstalled('aws')
  // if(typeof isInstalled === 'string') {
  //   console.log('Already installed but ignoring', isInstalled)
  //   // TODO Figure out what is best to do when already found
  //   // return isInstalled
  // }

  // let installFilePath = await tool.downloadFile()

  // const rootPath = path.parse(installFilePath).dir
  // const installDestinationDir = IS_WINDOWS ? 'C:\\PROGRA~1\\Amazon\\AWSCLI' : path.join(rootPath, '.local', 'lib', 'aws')
  // // const installArgs: string[] = IS_WINDOWS ? ['/install', '/quiet', '/norestart'] : ['-i', installDestinationDir]
  // const binFile = IS_WINDOWS ? 'aws.exe' : 'aws'
  // const installedBinary = path.join(installDestinationDir, 'bin', binFile)

  // if (path.parse(installFilePath).ext === '.zip') {
  //   const extractedPath = await tool.extractFile(installFilePath)
  //   installFilePath = path.join(extractedPath, 'awscli-bundle', 'install')
  // }

  // const installArgs: string[] = IS_WINDOWS ? ['/install', '/quiet', '/norestart'] : [installFilePath, '-i', installDestinationDir]

  // await tool.installPackage(IS_WINDOWS ? installFilePath : "python3", installArgs)

  // const toolCachePath = await tool.cacheTool(installedBinary)
  // await addPath(toolCachePath)

  // return toolCachePath
}

// if (process.env.NODE_ENV != 'test') (async () => await _installTool())()
