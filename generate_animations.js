// Run this file after you finish customizing your avatar
const spawn = require('child_process').spawn;
const events = require('events');
const myEmitter = new events.EventEmitter();

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
};


// function that generates a message to notify what animation is being created
const makeProcessingMessages = (file_name) => {
    console.log('Processing ' + file_name.slice(0, file_name.length-5) + '...');
}


// function that generates a message to notify what animations have been created
const makeCompletedMessages = (file_name) => {
    console.log(file_name.slice(0, file_name.length-5) + '.gif generated')
}


// function to handle child process exiting
const handleExit = (finished_spawn, prev_anim, next_anim, code) => {
    if (code == 0) {
        myEmitter.emit(finished_spawn);
        makeCompletedMessages(animations[prev_anim]);
        makeProcessingMessages(animations[next_anim]);

    } else {
        console.log('Python script closed with code ' + code);
    }
}


// file names of all animations to be generated
const animations = ['boxing.yaml', 'facepalm.yaml', 'head_tilt.yaml', 'jumping_arms_up.yaml', 'jumping_in_place.yaml', 'kicking_left.yaml', 'left_hand_on_head.yaml', 'left_hand_wave.yaml', 'looking_around.yaml', 'right_hand_on_head.yaml', 'right_hand_wave.yaml', 'superman_left.yaml', 'superman_right.yaml', 'two_hand_wave.yaml', 'walking.yaml', 'wave_dance.yaml'];


// spawning children
const firstSpawn = spawn(venvPath, [pythonScriptPath, ...pythonArgs, animations[0]], options);
makeProcessingMessages(animations[0]);

firstSpawn.on('exit', (code) => {
    handleExit('firstSpawn-finished', 0, 1, code);
});

myEmitter.on('firstSpawn-finished', () => {
    secondSpawn = spawn(venvPath, [pythonScriptPath, ...pythonArgs, animations[1]], options);

    secondSpawn.on('exit', (code) => {
        handleExit('secondSpawn-finished', 1, 2, code);
    });
});


myEmitter.on('secondSpawn-finished', () => {
    thirdSpawn = spawn(venvPath, [pythonScriptPath, ...pythonArgs, animations[2]], options);

    thirdSpawn.on('exit', (code) => {
        handleExit('thirdSpawn-finished', 2, 3, code);
    });
});


myEmitter.on('thirdSpawn-finished', () => {
    fourthSpawn = spawn(venvPath, [pythonScriptPath, ...pythonArgs, animations[3]], options);

    fourthSpawn.on('exit', (code) => {
        handleExit('fourthSpawn-finished', 3, 4, code);
    });
});


myEmitter.on('fourthSpawn-finished', () => {
    fifthSpawn = spawn(venvPath, [pythonScriptPath, ...pythonArgs, animations[4]], options);

    fifthSpawn.on('exit', (code) => {
        handleExit('fifthSpawn-finished', 4, 5, code);
    });
});


myEmitter.on('fifthSpawn-finished', () => {
    sixthSpawn = spawn(venvPath, [pythonScriptPath, ...pythonArgs, animations[5]], options)

    sixthSpawn.on('exit', (code) => {
        handleExit('sixthSpawn-finished', 5, 6, code);
    });
});


myEmitter.on('sixthSpawn-finished', () => {
    seventhSpawn = spawn(venvPath, [pythonScriptPath, ...pythonArgs, animations[6]], options);

    seventhSpawn.on('exit', (code) => {
        handleExit('seventhSpawn-finished', 6, 7, code);
    });
});


myEmitter.on('seventhSpawn-finished', () => {
    eightSpawn = spawn(venvPath, [pythonScriptPath, ...pythonArgs, animations[7]], options);

    eightSpawn.on('exit', (code) => {
        handleExit('eightSpawn-finished', 7, 8, code);
    });
});


myEmitter.on('eightSpawn-finished', () => {
    ninthSpawn = spawn(venvPath, [pythonScriptPath, ...pythonArgs, animations[8]], options);

    ninthSpawn.on('exit', (code) => {
        handleExit('ninthSpawn-finished', 8, 9, code);
    });
});


myEmitter.on('ninthSpawn-finished', () => {
    tenthSpawn = spawn(venvPath, [pythonScriptPath, ...pythonArgs, animations[9]], options);

    tenthSpawn.on('exit', (code) => {
        handleExit('tenthSpawn-finished', 9, 10, code);
    });
});


myEmitter.on('tenthSpawn-finished', () => {
    eleventhSpawn = spawn(venvPath, [pythonScriptPath, ...pythonArgs, animations[10]], options)

    eleventhSpawn.on('exit', (code) => {
        handleExit('eleventhSpawn-finished', 10, 11, code);
    });
});


myEmitter.on('eleventhSpawn-finished', () => {
    twelthSpawn = spawn(venvPath, [pythonScriptPath, ...pythonArgs, animations[11]], options)

    twelthSpawn.on('exit', (code) => {
        handleExit('twelthSpawn-finished', 11, 12, code);
    });
});


myEmitter.on('twelthSpawn-finished', () => {
    thirteenthSpawn = spawn(venvPath, [pythonScriptPath, ...pythonArgs, animations[12]], options)

    thirteenthSpawn.on('exit', (code) => {
        handleExit('thirteenthSpawn-finished', 12, 13, code);
    });
});


myEmitter.on('thirteenthSpawn-finished', () => {
    fourteenthSpawn = spawn(venvPath, [pythonScriptPath, ...pythonArgs, animations[13]], options)

    fourteenthSpawn.on('exit', (code) => {
        handleExit('fourteenthSpawn-finished', 13, 14, code);
    });
});


myEmitter.on('fourteenthSpawn-finished', () => {
    fifteenthSpawn = spawn(venvPath, [pythonScriptPath, ...pythonArgs, animations[14]], options);

    fifteenthSpawn.on('exit', (code) => {
        handleExit('fifteenthSpawn-finished', 14, 15, code);
    });
});


myEmitter.on('fifteenthSpawn-finished', () => {
    sixteenthSpawn = spawn(venvPath, [pythonScriptPath, ...pythonArgs, animations[15]], options);

    sixteenthSpawn.on('exit', (code) => {
        if (code == 0) {
            myEmitter.emit('sixteenthSpawn-finished');
            makeCompletedMessages(animations[15]);
            console.log('All animations have been generated. You can now use them in this project!');
        } else {
            console.log('Python script closed with code ' + code);
        }
    });
});
