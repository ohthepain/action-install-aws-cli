const fs = require('fs');
const os = require('os');
const path = require('path');

// TODO: Fix this import
const { exec } = require('child_process');

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
            // resolve(`AWS CLI installed successfully: ${stdout}`);
        });
    });
}

module.exports = { installMacOS };
