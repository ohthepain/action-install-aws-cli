"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._installTool = void 0;
const core_1 = require("@actions/core/lib/core");
const toolHandler_1 = require("./toolHandler");
const path = __importStar(require("path"));
const macOsSupport_1 = require("./macOsSupport");
const IS_WINDOWS = process.platform === 'win32' ? true : false;
const IS_MACOS = process.platform === 'darwin' ? true : false;
const IS_LINUX_ARM = (process.platform === 'darwin' && process.arch === 'arm') ? true : false;
const IS_LINUX_X64 = (process.platform === 'darwin' && process.arch !== 'arm') ? true : false;
const { exec } = require('child_process');
// Windows https://awscli.amazonaws.com/AWSCLIV2.msi
// MacOS https://awscli.amazonaws.com/AWSCLIV2.pkg
// Linux https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2-linux.html#cliv2-linux-install
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
async function _installTool() {
    // return installAWSCLI();
    if (IS_MACOS) {
        return (0, macOsSupport_1.installMacOS)();
    }
    const downloadUrl = IS_WINDOWS ? 'https://s3.amazonaws.com/aws-cli/AWSCLISetup.exe' : 'https://s3.amazonaws.com/aws-cli/awscli-bundle.zip';
    const tool = new toolHandler_1.DownloadExtractInstall(downloadUrl);
    const isInstalled = await tool.isAlreadyInstalled('aws');
    if (typeof isInstalled === 'string') {
        console.log('Already installed but ignoring', isInstalled);
        // TODO Figure out what is best to do when already found
        // return isInstalled
    }
    let installFilePath = await tool.downloadFile();
    const rootPath = path.parse(installFilePath).dir;
    const installDestinationDir = IS_WINDOWS ? 'C:\\PROGRA~1\\Amazon\\AWSCLI' : path.join(rootPath, '.local', 'lib', 'aws');
    // const installArgs: string[] = IS_WINDOWS ? ['/install', '/quiet', '/norestart'] : ['-i', installDestinationDir]
    const binFile = IS_WINDOWS ? 'aws.exe' : 'aws';
    const installedBinary = path.join(installDestinationDir, 'bin', binFile);
    if (path.parse(installFilePath).ext === '.zip') {
        const extractedPath = await tool.extractFile(installFilePath);
        installFilePath = path.join(extractedPath, 'awscli-bundle', 'install');
    }
    const installArgs = IS_WINDOWS ? ['/install', '/quiet', '/norestart'] : [installFilePath, '-i', installDestinationDir];
    await tool.installPackage(IS_WINDOWS ? installFilePath : "python3", installArgs);
    const toolCachePath = await tool.cacheTool(installedBinary);
    await (0, core_1.addPath)(toolCachePath);
    return toolCachePath;
}
exports._installTool = _installTool;
// if (process.env.NODE_ENV != 'test') (async () => await _installTool())()
//# sourceMappingURL=main.js.map