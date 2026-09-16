# Angular library for loading and playing audio using HTML 5

<img src="https://angular.dev/assets/images/press-kit/angular_icon_gradient.gif" alt="Angular" style="width:100px;"/>

## 📥 Installation

ngx-audio-control is available via npm and yarn

### Using npm:

`$ npm install ngx-kit --save`

### Using yarn:

`$ yarn add ngx-kit`

## 🌟 Getting Started

Import NgxAudioControl

```typescript
// Import library
import { NgxAudioControl } from 'ngx-kit/audio-control';

@NgModule({
    imports: [
        // ...
        NgxAudioControl,
    ],
})
export class AppModule {}
```

#### Usage

HTML

```html
<ngx-audio-control [fileList]="files" [linear]="true" [download]="true"></ngx-audio-control>
```

Ts

```typescript
@Component({
    selector: 'app-player',
    templateUrl: './player.component.html',
    styleUrls: ['./player.component.scss'],
})
export class PlayerComponent {
    files = ['assets/files/a.mp3', 'assets/files/b.mp3', 'assets/files/c.mp3'];
}
```

## Properties

#### @Input

| Name           | Description                                                                                                                               | Type                        | Default Value |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- | ------------- |
| [showList]     | Show play list button                                                                                                                     | boolean                     | true          |
| [download]     | Show download button                                                                                                                      | boolean                     | false         |
| [showFileName] | Display filename in header                                                                                                                | boolean                     | true          |
| [showSpeed]    | Show speed control                                                                                                                        | boolean                     | true          |
| [showVolume]   | Show volume control                                                                                                                       | boolean                     | true          |
| [linear]       | Display vertically or horizontally between control buttons and range seeker                                                               | boolean                     | false         |
| [preload]      | This enumerated attribute is intended to provide a hint to the browser about what the author thinks will lead to the best user experience | 'none', 'metadata' , 'auto' | 'metadata'    |

---

> ## 🔰 for seek audio file in chrome:

## IIS web.config

```xml
<system.webServer>
  <httpProtocol>
    <customHeaders>
      <add name="Accept-Ranges" value="bytes" />
    </customHeaders>
  </httpProtocol>
</system.webServer>
```

## Appache .htaccess

```xml
<IfModule mod_headers.c>
    Header set Accept-Ranges bytes
</IfModule>
```

## NginX nginx.conf

```
{
  http {
    server {
        location / {
            add_header Accept-Ranges bytes;
        }
    }
  }
}

```