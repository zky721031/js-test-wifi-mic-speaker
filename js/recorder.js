const $$ = s => document.querySelector(s)
let mic, recorder, soundFile

$$('#record').addEventListener('click', () => {
    record();
})

$$('#stop').addEventListener('click', () => {
    stop();
})

function setup() {
    // init
    mic = new p5.AudioIn()
    recorder = new p5.SoundRecorder()
    soundFile = new p5.SoundFile()
    //setup
    recorder.setInput(mic);
}

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