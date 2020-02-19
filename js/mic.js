const audioInputSelect = document.querySelector('select#audioSource');
const selectors = [audioInputSelect];

function gotDevices(deviceInfos) {
    // Handles being called several times to update labels. Preserve values.
    const values = selectors.map(select => select.value);
    selectors.forEach(select => {
        while (select.firstChild) {
            select.removeChild(select.firstChild);
        }
    });
    for (let i = 0; i !== deviceInfos.length; ++i) {
        const deviceInfo = deviceInfos[i];
        const option = document.createElement('option');
        option.value = deviceInfo.deviceId;
        if (deviceInfo.kind === 'audioinput') {
            option.text = deviceInfo.label || `microphone ${audioInputSelect.length + 1}`;
            audioInputSelect.appendChild(option);
        } else {
            console.log('Some other kind of source/device: ', deviceInfo);
        }
    }
    selectors.forEach((select, selectorIndex) => {
        if (Array.prototype.slice.call(select.childNodes).some(n => n.value === values[selectorIndex])) {
            select.value = values[selectorIndex];
        }
    });
}

navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);

function gotStream(stream) {
    window.stream = stream; // make stream available to console
    // Refresh button list in case labels have become available
    return navigator.mediaDevices.enumerateDevices();
}

function handleError(error) {
    console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
}

function goStart() {
    if (window.stream) {
        window.stream.getTracks().forEach(track => {
            track.stop();
        });
    }
    const audioSource = audioInputSelect.value;
    const constraints = {
        audio: {
            deviceId: audioSource ? {
                exact: audioSource
            } : undefined
        }
    };
    navigator.mediaDevices.getUserMedia(constraints).then(gotStream).then(gotDevices).catch(handleError);
}

audioInputSelect.onchange = goStart;


// P5js
const $$ = s => document.querySelector(s)
let mic, recorder, soundFile

$$('#record').addEventListener('click', () => {
    record();
    goStart();
})

$$('#stop').addEventListener('click', () => {
    stop();
})

/*function setup() {
    // init
    mic = new p5.AudioIn()
    recorder = new p5.SoundRecorder()
    soundFile = new p5.SoundFile()
    //setup
    recorder.setInput(mic);
}*/

function record() {
    mic.start()
    recorder.record(soundFile)
    $$('#stop').classList.remove('d-none')
    $$('#record').classList.add('d-none')
}

function stop() {
    mic.stop()
    recorder.stop()
    soundFile.play()
    $$('#stop').classList.add('d-none')
    $$('#record').classList.remove('d-none')
}