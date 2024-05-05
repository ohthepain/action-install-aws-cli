import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

// TODO: Fix this import
const { exec } = require('child_process');

function createTempFilePath(filename: string): string {
    // Get the path to the system's temporary directory
    const tempDir = os.tmpdir();

    // Generate a unique filename for the temporary file
    const tempFilePath = path.join(tempDir, filename);

    // Create an empty file at the temporary path
    // fs.closeSync(fs.openSync(tempFilePath, 'w'));

    // console.log(`Temporary file created at: ${tempFilePath}`);
    return tempFilePath;
}

async function replaceUserFolderInFile(filename:string): Promise<string | undefined> {
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

export async function installMacOS() : Promise<string> {
    const choicesPath = await replaceUserFolderInFile('macosInstallInfo.xml');
    const installerPath = createTempFilePath('AWSCLIV2.pkg');
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

        // const downloadCommand = `curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o ${installerPath}`;
        // // const curlCommand = "curl \"https://awscli.amazonaws.com/AWSCLIV2.pkg\" -o \"AWSCLIV2.pkg\" && \"installer -pkg AWSCLIV2.pkg -target CurrentUserHomeDirectory -applyChoiceChangesXML ${choicesPath}\"";
        // await exec(downloadCommand, (error: { message: any; }, stdout: any, stderr: any) => {
        //     if (error) {
        //         reject(`Error downloading AWS CLI: ${error.message}`);
        //     }
        //     if (stderr) {
        //         reject(`Error output: ${stderr}`);
        //     }
        //     resolve(`AWS CLI downloaded successfully: ${stdout}`);
        // });

        // const installCommand = `installer -pkg ${installerPath} -target CurrentUserHomeDirectory -applyChoiceChangesXML ${choicesPath}`;
        // exec(installCommand, (error: { message: any; }, stdout: any, stderr: any) => {
        //     if (error) {
        //         reject(`Error installing AWS CLI: ${error.message}`);
        //     }
        //     if (stderr) {
        //         reject(`Error output: ${stderr}`);
        //     }
        //     resolve(`AWS CLI installed successfully: ${stdout}`);
        // });

        const curlCommand = `curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o ${installerPath} && installer -pkg ${installerPath} -target CurrentUserHomeDirectory -applyChoiceChangesXML ${choicesPath}`;
        // const curlCommand = "curl \"https://awscli.amazonaws.com/AWSCLIV2.pkg\" -o \"AWSCLIV2.pkg\" && \"installer -pkg AWSCLIV2.pkg -target CurrentUserHomeDirectory -applyChoiceChangesXML ${choicesPath}\"";
        exec(curlCommand, (error: { message: any; }, stdout: any, stderr: any) => {
            if (error) {
                reject(`Error installing AWS CLI: ${error.message}`);
            }
            // if (stderr) {
            //     reject(`Error output: ${stderr}`);
            // }
            resolve(`AWS CLI installed successfully: ${stdout}`);
        });
    });
  }
  
