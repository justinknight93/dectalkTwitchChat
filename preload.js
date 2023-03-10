const { contextBridge } = require('electron');
const tmi = require('tmi.js');
require('dotenv').config();
const gkm = require('gkm');
const exec = require('child_process').execFile;
const player = require('node-wav-player');

const black = "black";
const red = "red";
const blue = "blue";
const green = "green";
const yellow = "yellow";
const purple = "purple";

const logs = [];
const log = (message,color=black) => { logs.push({message,color}); };
const clear = () => { logs.splice(0, logs.length);  };


log("HELLO!");
log("Creating client");

const client = new tmi.Client({
    connection: {
        reconnect: true
    },
    channels: [
        process.env.TWITCH_CHANNEL
    ]
});

log("Connecting client to Twitch");

client.connect();
const messageQueue = [];

log("Ready to talk.",green)

client.on('message', async (channel, context, message) => {
    messageQueue.push(message);
    showCurrentMessage();
});

gkm.events.on('key.pressed', function (data) {

    if (data == "F9") {
        if (messageQueue.length > 0) {

            sayMessage(messageQueue[0]);
            messageQueue.splice(0, 1)
            showCurrentMessage();
            log("Saying message.");
        } else {
            log("No new messages.")
        }
    }

    if (data == "F10") {
        if (messageQueue.length > 0) {

            messageQueue.splice(0, 1)
            showCurrentMessage();
            log("Skipped message.");
        } else {
            log("No new messages.")
        }
    }

    if (data == "F12") {
        killAllTTS();

    }
});

const showCurrentMessage = () => {
    if (messageQueue.length > 0) {
        clear();
        log("");
        log("-------------------------------------------");
        log("Would you like to send this message to TTS? (yes:F9 no:F10)");
        log(messageQueue[0],blue)
        log("-------------------------------------------");
        log(`${messageQueue.length - 1} more messages in queue.`)
    }
}

const sayMessage = (message) => {
    exec('say.exe', ["-w",`../sounds/speech.wav`,`[:PHONEME ${process.env.PHONEME}] ${message}`], { cwd: './DECtalk/' }, (err, data) => {
        if (err) log(err);
        
    });

    player.play({
        path: 'sounds/speech.wav',
      }).then(() => {
        showCurrentMessage();
        log('The wav file started to be played successfully.');
      }).catch((error) => {
        showCurrentMessage();
        log(error);
      });

    
}

const killAllTTS = () => {
    player.stop();
    showCurrentMessage();
    log("Stopped talking.");
}


contextBridge.exposeInMainWorld('getLogs', () => logs)
