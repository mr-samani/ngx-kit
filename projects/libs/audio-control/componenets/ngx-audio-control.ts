import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  effect,
  ElementRef,
  Inject,
  input,
  Input,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxAudioControl implements OnInit {
  /**
   * Show play list button
   */
  readonly showList = input<boolean>(true);
  /**
   * Show download button
   */
  readonly download = input<boolean>(false);
  /**
   * Display filename in header
   */
  readonly showFileName = input<boolean>(true);
  /**
   * Show speed control
   */
  readonly showSpeed = input<boolean>(true);
  /**
   * Show volume control
   */
  readonly showVolume = input<boolean>(true);
  /**
   * Display vertically or horizontally between control buttons and range seeker
   */
  readonly linear = input<boolean>(false);
  /**
 This enumerated attribute is intended to provide a hint to the browser about what the author thinks will lead to the best user experience. It may have one of the following values:

    #### `none`:  
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
  readonly preload = input<'none' | 'metadata' | 'auto'>('metadata');

  /**
   * set header when duration is inifinity and require call fetch request for get duration
   */
  readonly fetchHeaders = input<HeadersInit | undefined>(undefined);
  /**
   * An array list of file addresses in the form of strings
   */
  readonly fileList = input.required<string[]>();

  errorMessage = signal('');
  downloading = signal(false);

  fineName = signal('');
  speedDisplay = signal('1x');
  audioFiles = signal<PlayList[]>([]);

  currentTime = signal('00:00');
  totalTime = signal('00:00');
  options = {
    emptyListMessage: 'No any record',
  };
  togglePlayList = false;

  currentAudioIndex = 0;
  currentFileAddress = signal('');
  @ViewChild('audio', { static: true }) audio!: ElementRef<HTMLAudioElement>;
  seekSlider = signal({
    min: 0,
    max: Infinity,
    value: 0,
  });
  buffering = signal(false);
  errorLoad = signal(false);
  constructor(@Inject(DOCUMENT) private _doc: Document) {
    effect(() => {
      const list = this.fileList();
      for (let item of list) {
        this.audioFiles().push({
          fileAddress: item,
          title: decodeURIComponent(item).replace(/\\/g, '/').split(/\//g).pop() ?? 'no name',
        });
      }
      this.initialize();
    });
  }

  ngOnInit(): void {
    this.audio.nativeElement.onloadedmetadata = (ev) => {
      this.getDuration().then((duration) => {
        this.seekSlider().max = duration;
        this.totalTime.set(formatTime(duration));
      });
    };

    this.audio.nativeElement.onloadstart = () => {
      this.buffering.set(true);
      this.errorLoad.set(false);
      this.errorMessage.set('');
    };
    this.audio.nativeElement.onloadeddata = () => {
      this.buffering.set(false);
      this.errorLoad.set(false);
      this.errorMessage.set('');
    };
    this.audio.nativeElement.addEventListener(
      'error',
      (e) => {
        this.buffering.set(false);
        this.errorLoad.set(true);
        var noSourcesLoaded =
          (e.currentTarget as any).networkState === HTMLMediaElement.NETWORK_NO_SOURCE;
        if (noSourcesLoaded) {
          console.error('player', 'could not load audio source');
          this.errorMessage.set('Player could not load audio source');
        } else {
          console.error('player', 'unknow error!');
          this.errorMessage.set('Player: unknow error!');
        }
      },
      true,
    );

    this.audio.nativeElement.ontimeupdate = () => {
      this.seekSlider().value = this.audio.nativeElement.currentTime;
      this.currentTime.set(formatTime(this.audio.nativeElement.currentTime));
    };
  }

  private initialize(currentAudioIndex = 0, playAfterLoad = false) {
    this.speedDisplay.set('1x');
    this.currentTime.set('00:00');
    this.totalTime.set('00:00');
    this.currentAudioIndex = currentAudioIndex;
    this.currentFileAddress.set('');
    this.seekSlider.set({
      min: 0,
      max: Infinity,
      value: 0,
    });
    this.stop();
    if (this.audioFiles().length > 0 && this.audioFiles()[this.currentAudioIndex]) {
      this.currentFileAddress.set(this.audioFiles()[this.currentAudioIndex].fileAddress);
      this.fineName.set(this.audioFiles()[this.currentAudioIndex].title);
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
    if (this.seekSlider().max == Infinity) {
      this.getDuration(true).then((duration) => {
        this.seekSlider().max = duration;
        this.totalTime.set(formatTime(duration));
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
    this.seekSlider().value += second;
    if (this.seekSlider().value < this.seekSlider().min) this.seekSlider().value = 0;
    if (this.seekSlider().value > this.seekSlider().max)
      this.seekSlider().value = this.seekSlider().max;
    this.audio.nativeElement.currentTime = this.seekSlider().value;
    // console.log(this.seekSlider().value, this.audio.nativeElement.currentTime);
  }

  increaseSpeed() {
    const delta = 0.25;
    this.audio.nativeElement.playbackRate = Math.max(
      0.5,
      this.audio.nativeElement.playbackRate + delta,
    );
    this.speedDisplay.set(this.audio.nativeElement.playbackRate.toFixed(2) + 'x');
  }

  decreaseSpeed() {
    const delta = -0.25;
    this.audio.nativeElement.playbackRate = Math.max(
      0.5,
      this.audio.nativeElement.playbackRate + delta,
    );
    this.speedDisplay.set(this.audio.nativeElement.playbackRate.toFixed(2) + 'x');
  }

  changeVolume(ev: Event) {
    let value = (ev.target as HTMLInputElement).value;
    this.audio.nativeElement.volume = +value;
  }
  previous() {
    this.currentAudioIndex--;
    if (this.currentAudioIndex < 0) {
      this.currentAudioIndex = this.audioFiles().length - 1;
    }
    this.initialize(this.currentAudioIndex, true);
  }

  next() {
    this.currentAudioIndex++;
    if (this.currentAudioIndex >= this.audioFiles().length) {
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
    if (!this.currentFileAddress()) return;
    this.downloading.set(true);
    var a: any = this._doc.createElement('a');
    this._doc.body.appendChild(a);
    a.style = 'display: none';
    a.href = this.currentFileAddress();
    a.download = this.fineName();
    a.click();
    window.URL.revokeObjectURL(this.currentFileAddress());
    a.remove();
    setTimeout(() => {
      this.downloading.set(false);
    }, 1000);
  }

  private getDuration(play = false): Promise<number> {
    return new Promise(async (resolve, reject) => {
      if (
        Number.isInteger(+this.audio.nativeElement.duration) ||
        (this.preload() !== 'auto' && !play)
      ) {
        resolve(this.audio.nativeElement.duration);
        return;
      }

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const audioFilePath = this.currentFileAddress();
      try {
        const response = await fetch(audioFilePath, {
          headers: this.fetchHeaders(),
        });
        const arrayBuffer = await response.arrayBuffer();
        audioContext.decodeAudioData(arrayBuffer, ({ duration }) => {
          audioContext.close();
          resolve(duration);
        });
      } catch (error) {
        console.error('duration:', error);
        reject(error);
        this.errorMessage.set('player could not get audio duration');
      }
    });
  }
}
