let mediaRecorder: MediaRecorder;
let recorder: MediaRecorder;
let mediaStream: MediaStream;
let recordedChunks: Array<Blob> = [];

const constraints = {"video": {width: {max: 320}}, "audio": true};

const gotMedia = (stream: MediaStream) => {
    console.log('recording started')
    mediaStream = stream;
    let video = document.querySelector('video');
    video!.srcObject = stream;

    try {
        recorder = new MediaRecorder(stream, {mimeType: "video/webm"})
    } catch (e) {
        console.log(e);
        return;
    }

    mediaRecorder = recorder;

    recorder.ondataavailable = (event) => {
        recordedChunks.push(event.data)
    }
    recorder.start(100)
}

export const startRecording = () => {
    navigator.mediaDevices.getUserMedia(constraints).then(gotMedia).catch(e => {console.log(e)})
    recordedChunks = [];
}


export const downloadRecording = () => {
    mediaRecorder.stop();
    mediaStream.getTracks().forEach(track => { track.stop(); });

    let blob = new Blob(recordedChunks, {type: "video/webm"});
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    document.body.appendChild(a);
    a.href = url;
    a.download = 'test.webm';
    a.click();    
}

