/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 894:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { exec } = __nccwpck_require__(81);
const path = __nccwpck_require__(17);
const { installMacOS } = __nccwpck_require__(193);

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
  const tool = new DownloadExtractInstall(downloadUrl)

  const isInstalled = await tool.isAlreadyInstalled('aws')
  if (typeof isInstalled === 'string') {
    console.log('WARNING: AWS CLI is already installed but we shall continue');
    // TODO: Figure out what is best to do when already found
    // return isInstalled
  }

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


/***/ }),

/***/ 193:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const fs = __nccwpck_require__(147);
const os = __nccwpck_require__(37);
const path = __nccwpck_require__(17);

// TODO: Fix this import
const { exec } = __nccwpck_require__(81);

function createTempFilePath(filename) {
    // Get the path to the system's temporary directory
    const tempDir = os.tmpdir();

    // Generate a unique filename for the temporary file
    const tempFilePath = path.join(tempDir, filename);

    // Create an empty file at the temporary path
    // fs.closeSync(fs.openSync(tempFilePath, 'w'));

    // console.log(`Temporary file created at: ${tempFilePath}`);
    return tempFilePath;
}

async function replaceUserFolderInFile(filename) {
    try {
        const data = await fs.promises.readFile(filename, 'utf8');
        const userFolder = os.homedir();
        const updatedData = data.replace(/{USER_FOLDER}/g, userFolder);
        const tempPath = createTempFilePath(filename);
        await fs.promises.writeFile(tempPath, updatedData, 'utf8');
        console.log('Wrote %s', tempPath);
        return tempPath;
    } catch (error) {
        console.error('Error updating the file:', error);
    }
}

async function installMacOS() {
    const choicesPath = await replaceUserFolderInFile('macosInstallInfo.xml');
    const installerPath = createTempFilePath('AWSCLIV2.pkg');
    return new Promise((resolve, reject) => {
        const curlCommand = `curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o ${installerPath} && installer -pkg ${installerPath} -target CurrentUserHomeDirectory -applyChoiceChangesXML ${choicesPath}`;
        exec(curlCommand, (error, stdout) => {
            if (error) {
                reject(`Error installing AWS CLI: ${error.message}`);
            }
            resolve(`AWS CLI installed successfully: ${stdout}`);
        });
    });
}

module.exports = { installMacOS };


/***/ }),

/***/ 81:
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),

/***/ 147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 37:
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ 17:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __nccwpck_require__(894);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;