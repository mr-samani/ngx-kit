import { Component, DOCUMENT, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { formatTime } from '../utils/format-time';
import { PlayList } from '../contracts/play-list';
import { CommonModule } from '@angular/common';

// svg ICONS from
// https://iconstack.io/library/hugeicon

@Component({
    standalone: true,
    selector: 'ngx-audio-control',
    templateUrl: './ngx-audio-control.html',
    styleUrls: ['./ngx-audio-control.scss'],
    imports: [CommonModule],
})
export class NgxAudioControl implements OnInit {
    /**
     * Show play list button
     */
    @Input() showList: boolean = true;
    /**
     * Show download button
     */
    @Input() download: boolean = false;
    /**
     * Display filename in header
     */
    @Input() showFileName: boolean = true;
    /**
     * Show speed control
     */
    @Input() showSpeed: boolean = true;
    /**
     * Show volume control
     */
    @Input() showVolume: boolean = true;
    /**
     * Display vertically or horizontally between control buttons and range seeker
     */
    @Input() linear: boolean = false;
    /**
 This enumerated attribute is intended to provide a hint to the browser about what the author thinks will lead to the best user experience. It may have one of the following values:

    * #### `none`:  
    Indicates that the audio should not be preloaded.
    #### `metadata`:
    Indicates that only audio metadata (e.g. length) is fetched.
    #### `auto`: 
    Indicates that the whole audio file can be downloaded, even if the user is not expected to use it.
    
    ## Usage notes:
    The autoplay attribute has precedence over preload. If autoplay is specified, the browser would obviously need to start downloading the audio for playback.
    The browser is not forced by the specification to follow the value of this attribute; it is a mere hint.
    ## Default value is `metadata`
   */
    @Input() preload: 'none' | 'metadata' | 'auto' = 'metadata';

    /**
     * set header when duration is inifinity and require call fetch request for get duration
     */
    @Input() fetchHeaders: HeadersInit | undefined = undefined;
    /**
     * An array list of file addresses in the form of strings
     */
    @Input() set fileList(val: string[]) {
        this.audioFiles = [];
        if (!val || Array.isArray(val) == false) {
            return;
        }
        for (let item of val) {
            this.audioFiles.push({
                fileAddress: item,
                title: decodeURIComponent(item).replace(/\\/g, '/').split(/\//g).pop() ?? 'no name',
            });
        }
        this.initialize();
    }

    downloading = false;

    fineName = '';
    speedDisplay = '1x';
    audioFiles: PlayList[] = [];

    currentTime = '00:00';
    totalTime = '00:00';
    options = {
        emptyListMessage: 'No any record',
    };
    togglePlayList = false;

    currentAudioIndex = 0;
    currentFileAddress = '';
    @ViewChild('audio', { static: true }) audio!: ElementRef<HTMLAudioElement>;
    seekSlider = {
        min: 0,
        max: Infinity,
        value: 0,
    };
    buffering = false;
    errorLoad = false;
    constructor(@Inject(DOCUMENT) private _doc: Document) {}

    ngOnInit(): void {
        this.audio.nativeElement.onloadedmetadata = (ev) => {
            this.getDuration().then((duration) => {
                this.seekSlider.max = duration;
                this.totalTime = formatTime(duration);
            });
        };

        this.audio.nativeElement.onloadstart = () => {
            this.buffering = true;
            this.errorLoad = false;
        };
        this.audio.nativeElement.onloadeddata = () => {
            this.buffering = false;
            this.errorLoad = false;
        };
        this.audio.nativeElement.addEventListener(
            'error',
            (e) => {
                this.buffering = false;
                this.errorLoad = true;
                var noSourcesLoaded = (e.currentTarget as any).networkState === HTMLMediaElement.NETWORK_NO_SOURCE;
                if (noSourcesLoaded) console.error('player', 'could not load audio source');
                else console.error('player', 'unknow error!');
            },
            true
        );

        this.audio.nativeElement.ontimeupdate = () => {
            this.seekSlider.value = this.audio.nativeElement.currentTime;
            this.currentTime = formatTime(this.audio.nativeElement.currentTime);
        };
    }

    private initialize(currentAudioIndex = 0, playAfterLoad = false) {
        this.speedDisplay = '1x';
        this.currentTime = '00:00';
        this.totalTime = '00:00';
        this.currentAudioIndex = currentAudioIndex;
        this.currentFileAddress = '';
        this.seekSlider = {
            min: 0,
            max: Infinity,
            value: 0,
        };
        this.stop();
        if (this.audioFiles.length > 0 && this.audioFiles[this.currentAudioIndex]) {
            this.currentFileAddress = this.audioFiles[this.currentAudioIndex].fileAddress;
            this.fineName = this.audioFiles[this.currentAudioIndex].title;
            this.audio.nativeElement.load();
        }
        if (playAfterLoad) {
            this.play();
        }
    }

    playPause() {
        if (this.audio.nativeElement.paused) {
            this.play();
        } else {
            this.stop();
        }
    }

    play(offset = 0) {
        this.audio.nativeElement.play();
        if (this.seekSlider.max == Infinity) {
            this.getDuration(true).then((duration) => {
                this.seekSlider.max = duration;
                this.totalTime = formatTime(duration);
            });
        }
    }

    stop() {
        this.audio.nativeElement.pause();
    }

    muteUnmute() {
        this.audio.nativeElement.muted = !this.audio.nativeElement.muted;
    }

    seekAudio(ev: Event) {
        const range = ev.target as HTMLInputElement;
        this.audio.nativeElement.currentTime = +range.value;
    }

    /**
     * skip audio track by second
     * @param second second is +10 or -10
     */
    skipTrack(second: number) {
        this.seekSlider.value += second;
        if (this.seekSlider.value < this.seekSlider.min) this.seekSlider.value = 0;
        if (this.seekSlider.value > this.seekSlider.max) this.seekSlider.value = this.seekSlider.max;
        this.audio.nativeElement.currentTime = this.seekSlider.value;
        console.log(this.seekSlider.value, this.audio.nativeElement.currentTime);
    }

    increaseSpeed() {
        const delta = 0.25;
        this.audio.nativeElement.playbackRate = Math.max(0.5, this.audio.nativeElement.playbackRate + delta);
        this.speedDisplay = this.audio.nativeElement.playbackRate.toFixed(2) + 'x';
    }

    decreaseSpeed() {
        const delta = -0.25;
        this.audio.nativeElement.playbackRate = Math.max(0.5, this.audio.nativeElement.playbackRate + delta);
        this.speedDisplay = this.audio.nativeElement.playbackRate.toFixed(2) + 'x';
    }

    changeVolume(ev: Event) {
        let value = (ev.target as HTMLInputElement).value;
        this.audio.nativeElement.volume = +value;
    }
    previous() {
        this.currentAudioIndex--;
        if (this.currentAudioIndex < 0) {
            this.currentAudioIndex = this.audioFiles.length - 1;
        }
        this.initialize(this.currentAudioIndex, true);
    }

    next() {
        this.currentAudioIndex++;
        if (this.currentAudioIndex >= this.audioFiles.length) {
            this.currentAudioIndex = 0;
        }
        this.initialize(this.currentAudioIndex, true);
    }

    playNext() {
        this.next();
    }

    onClickPlayList(index: number) {
        this.currentAudioIndex = index;
        this.initialize(this.currentAudioIndex, true);
    }

    downloadCurrentFile() {
        if (!this.currentFileAddress) return;
        this.downloading = true;
        var a: any = this._doc.createElement('a');
        this._doc.body.appendChild(a);
        a.style = 'display: none';
        a.href = this.currentFileAddress;
        a.download = this.fineName;
        a.click();
        window.URL.revokeObjectURL(this.currentFileAddress);
        a.remove();
        setTimeout(() => {
            this.downloading = false;
        }, 1000);
    }

    private getDuration(play = false): Promise<number> {
        return new Promise(async (resolve, reject) => {
            if (Number.isInteger(+this.audio.nativeElement.duration) || (this.preload !== 'auto' && !play)) {
                resolve(this.audio.nativeElement.duration);
                return;
            }

            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const audioFilePath = this.currentFileAddress;
            try {
                const response = await fetch(audioFilePath, {
                    headers: this.fetchHeaders,
                });
                const arrayBuffer = await response.arrayBuffer();
                audioContext.decodeAudioData(arrayBuffer, ({ duration }) => {
                    audioContext.close();
                    resolve(duration);
                });
            } catch (error) {
                console.error('duration:', error);
                reject(error);
            }
        });
    }
}
