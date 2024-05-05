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
exports.installMacOS = void 0;
const fs = __importStar(require("fs"));
const os = __importStar(require("os"));
const path = __importStar(require("path"));
// TODO: Fix this import
const { exec } = require('child_process');
function createTempFilePath(filename) {
    // Get the path to the system's temporary directory
    const tempDir = os.tmpdir();
    // Generate a unique filename for the temporary file
    const tempFilePath = path.join(tempDir, filename);
    // Create an empty file at the temporary path
    fs.closeSync(fs.openSync(tempFilePath, 'w'));
    console.log(`Temporary file created at: ${tempFilePath}`);
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
    }
    catch (error) {
        console.error('Error updating the file:', error);
    }
}
async function installMacOS() {
    const filename = 'macosInstallInfo.xml';
    const choicesPath = await replaceUserFolderInFile(filename);
    return new Promise((resolve, reject) => {
        //   exec('installer', (error: { message: any; }, stdout: any, stderr: any) => {
        //     if (error) {
        //         reject(`Error installing AWS CLI: ${error.message}`);
        //     }
        //     if (stderr) {
        //         reject(`Error output: ${stderr}`);
        //     }
        //     resolve(`AWS CLI installed successfully: ${stdout}`);
        //   });
        // const curlCommand = 'curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg" && "installer -pkg AWSCLIV2.pkg -target CurrentUserHomeDirectory -applyChoiceChangesXML ${choicesPath}"';
        const curlCommand = "curl \"https://awscli.amazonaws.com/AWSCLIV2.pkg\" -o \"AWSCLIV2.pkg\" && \"installer -pkg AWSCLIV2.pkg -target CurrentUserHomeDirectory -applyChoiceChangesXML ${choicesPath}\"";
        exec(curlCommand, (error, stdout, stderr) => {
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
exports.installMacOS = installMacOS;
//# sourceMappingURL=macOsSupport.js.map