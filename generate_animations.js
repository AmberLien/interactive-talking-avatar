// Run this file after you finish customizing your avatar
const spawn = require('child_process').spawn;

const avatarImage = ''; // Fill in your avatar's url here  

const pythonScriptPath = './talking_avatar.py';

const cwdPath = ''; // Fill in the working directory where talking_avatar.py will be run here

const venvPath = ''; // Fill in the path to your virtual env here

// arguments for talking_avatar.py script
const pythonArgs = [avatarImage, 'talking_avatar_out']; // you may change talking_avatar_out to whatever you want to name your avatar and its directory

// options for spawned child
const options = {
    cwd: cwdPath, 
    detached: true,
    timeout: 130000
};

// spawn a child process
const pythonProcess = spawn(venvPath, [pythonScriptPath, ...pythonArgs], options);
console.log('Generating animations...');

pythonProcess.on('close', (code) => {
    if (code === 0) {
        console.log('Your animations have succesfully been generated. You can now use them in this project!');
    } else if (code === null) {
        console.log('The python script has timed out. Please rerun this file until your animations are completed.')
    } else {
        console.log('Python script exited with code ' + code);
    }
});
