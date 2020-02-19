# WebRTC study



#### enumerateDevices()

這個api是用來列出有哪些**多媒體的input與output可以用**～例如：webcam、microphone這些可以使用。其**裝置的資訊**(**MediaDeviceInfo**)會以<u><b>物件陣列</b></u>(Object in Array)透過<u><b><span>Promise</span></b></u>回傳。

```
navigator.mediaDevices.enumerateDevices()
    .then( devinfo => console.log(devinfo))
    .catch( err => console.warn(err));
```

#### audioinput:

代表一個**audio**的輸入裝置。例如：麥克風。  

#### videoinput:

代表一個**video**的輸入裝置。例如：網路攝影機。  

#### audioouput:

代表**audio**的輸出裝置。例如：一對頭戴式耳機。



通常我們把**audioinput**與**videoinput**的 **deviceId**抓出來後就可以透過上一章節的**getUserMedia()**的參數***<u>Constraints</u>***指定那一個webcam與microphone的影像與音軌顯示到 video 這個DOM tag上面。



<h4>Test WebRTC</h4>
<section>
  <label for="audioSelect">選擇Audio來源:</label>
  <select id="audioSelect"
    (change)="ChangeAudioSource($event.target.value)">
    <option *ngFor="let item of audioOption" [value]="item.value">
      {{item.text}}
    </option>
  </select>
</section>

<section>
  <label for="videoSelect">選擇Video來源:</label>
  <select id="videoSelect"
  (change)="ChangeVideoSource($event.target.value)">
    <option *ngFor="let item of videoOption" [value]="item.value" >
      {{item.text}}
    </option>
  </select>
</section>

<video id="video" autoplay></video>
<button class="stop-button" id="stopbtn" type="button"
(click)="stopBtn()">
  Stop
</button>



```
import { Component, OnInit, ElementRef} from '@angular/core';
/*
  typescript
*/
export class YourComponent implements OnInit {

  private el: ElementRef;
  private videoElement: HTMLVideoElement;
  public constraints: any;
  public videoOption = [];
  public audioOption = [];
  public videoValue: any;
  public audioValue: any;

  constructor(
    private element: ElementRef
  ) {
    this.el = this.element;
  }

  ngOnInit() {
    this.videoElement = <HTMLVideoElement>this.el.nativeElement
                        .querySelector('#video');
    navigator.mediaDevices.enumerateDevices()
    .then( dev => this.gotDevices(dev))
    .then( () => this.getStream())
    .catch(this.handleError);
  }
  gotDevices(deviceInfos) {
    for (let i = 0; i !== deviceInfos.length; ++i) {
      const deviceInfo = deviceInfos[i];
      if (deviceInfo.kind === 'audioinput') {
        let audioObj = {value: '', text: ''};
        audioObj.value = deviceInfo.deviceId;
        audioObj.text = deviceInfo.label || 'microphone' + 
                        (this.audioOption.length + 1);
        this.audioOption.push(audioObj);
      } else if (deviceInfo.kind === 'videoinput') {
        let videoObj = { value: '', text: ''};
        videoObj.value = deviceInfo.deviceId;
        videoObj.text = deviceInfo.label || 'camera' +
                        (this.videoOption.length + 1);
        this.videoOption.push(videoObj);
      } else {
        console.log(`Found another kind of device: ${deviceInfo}`);
      }
    }
    this.audioValue = this.audioOption[0].value;
    this.videoValue = this.videoOption[0].value;
  }

  getStream() {

    this.stopBtn();   // stop stream first
    this.constraints = {
      audio: {
        deviceId: { exact: this.audioValue }
      },
      video: {
        deviceId: { exact: this.videoValue },
        width: 640,
        height: 480
      }
    };

    navigator.mediaDevices.getUserMedia(this.constraints)
    .then( stream => this.videoElement.srcObject = stream)
    .catch(this.handleError);

  }

  handleError(error) {
    console.log('Error: ', error);
  }

  /**
   * 按鈕Stop的code.
   */
  stopBtn() {
    if (this.videoElement.srcObject) {
      (<MediaStream>this.videoElement.srcObject).getTracks()
      .forEach( stream => stream.stop());
    }
  }

  ChangeAudioSource(val) {
    this.audioValue = val;
    this.getStream();
  }

  ChangeVideoSource(val) {
    this.videoValue = val;
    this.getStream();
  }

}
```

#### gotDevices()

這個function主要把**enumerateDevices()** API回來的**裝置資訊Array**內中把 ***audioinput***與***videoinput***的物件取各自的**<u>deviceId</u>**與**<u>label</u>**資訊另存成一個物件，然後在把這個物件依照是來自audioinput的或是videoinput的加到**audioOption**或是**videoOption**陣列。  

這樣HTML那邊的Select tag就有audio跟video來源的選項可以選。



#### getStream()

這個function在gotDevices()做完後把選好的audio/video來源寫成**getUserMedia()**的**Constraint**，並且畫面指定大小為 640*480，接著先把原本的Stream關閉再把stream顯示在 html video tag.



#### ChangeAudioSource()

這個為我們在Html audio的**Select option**的 *change event function*。當使用者改變 Audio的選項時就會來執行這個function，這邊就是把新的Audio source 寫到 audioValue然後**再去執行getStream()來顯示新的audio stream**。



#### ChangeAudioiSource()

這個為我們在Html video的**Select option**的 *change event function*。當使用者改變 Video的選項時就會來執行這個function，這邊就是把新的Video source 寫到 videoValue然後**再去執行getStream()來顯示新的video stream**。  

這樣子就可以在多個WebCam下做切換並且在video tag中看到影像與聲音。



參考網址 => http://cloverhsc.blogspot.com/2018/09/webrtc-2-enumeratedevices.html

參考網址 => https://developers.google.com/web/updates/2015/10/media-devices



# 獲取錄音資訊 (getUserMedia)

參考網址 => https://www.oxxostudio.tw/articles/201601/web-audio-recorder.html

參考網址 => https://developers.google.com/web/fundamentals/media/recording-audio?hl=zh-tw



# 用 JavaScript 打造視訊錄影 APP（MediaRecorder API）

##### keywords: mediaRecorder, mediaStream, mediaDevices, Blob



參考網址 => https://pjchender.blogspot.com/2018/02/js-javascript-mediarecorder-api.html
