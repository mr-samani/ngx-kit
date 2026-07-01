# NgxDialog

🎉 Open angular component as a dialog(popup) in Angular Framework without Cdk Material

## 📦Demo

[🚀demo](https://mr-samani.web.app/demo/dialog)

## Install

- NPM: npm i @mr-samani/ngx-dialog
- YARN: yarn add @mr-samani/ngx-dialog

## Usage

Import `NgxDialogModule` to your working module

```
import { NgxDialogModule } from  'ngx-dialog';

@NgModule({
  imports: [
    NgxDialogModule
  ]
})
export class AppModule { }

```

## For open dialog

```
import { Component, OnInit } from '@angular/core';
import { NgxDialogService } from 'ngx-dialog';
import { ModalComponent } from './modal/modal.component';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent implements OnInit {

  constructor(
    private ngxDialog: NgxDialogService
  ) { }

  ngOnInit(): void {
  }


  openDialog() {
    this.ngxDialog.open(ModalComponent, {
      data: {
        a: 123
      },
      containerClass: 'my dialog ',
      allowCloseOnOutsideClick: true,
      maxWidth: '80%',
      maxHeight: '80%'
    }).afterClosed.subscribe((r: any) => {
      console.log('closed result=', r);
    });
  }

}
```

## Modal component

```
import { JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgxDialogConfig, DIALOG_REF, NgxDialogService } from 'ngx-dialog';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  data: any;
  private dialogRef = inject(DIALOG_REF);

  constructor(
    public config: NgxDialogConfig,
    private ngxDialog: NgxDialogService
  ) {
    this.data = config.data;
  }

  ngOnInit(): void {
  }

  ok() {
    alert('param=' + new JsonPipe().transform(this.data));
  }

  cancel() {
    this.dialogRef.close(this.data);
  }


  openNewDialog() {
    this.ngxDialog.open(ModalComponent, {
      data: {
        a: this.data.a + 1
      }
    }).afterClosed.subscribe((r: any) => {
      console.log('child closed result=', r);
    });
  }

}
```

## Modal html

```
<div ngx-dialog-header [showCloseButton]="true">
    header
</div>
<div ngx-dialog-body>
    <p>modal works!</p>
    {{data|json}}
</div>
<div ngx-dialog-footer [align]="'space-between'">
    <div>
        <button (click)="ok()" type="button" class="btn btn-primary mx-1">ok</button>
        <button (click)="cancel()" type="button" class="btn btn-warning mx-1">cancel</button>
    </div>

    <button (click)="openNewDialog()" type="button" class="btn btn-info mx-1">open New Dialog</button>
</div>
```

## For create draggable dialog:

you can use NgxDragableResizable library
[🚀npm](https://www.npmjs.com/package/ngx-dragable-resizable)
and change dialog header to:

```
 <div ngx-dialog-header [showCloseButton]="true" NgxDragableResizable [dragRootElement]="'.ngx-dialog'">
       header
 </div>
```

## Dialog config

| Name                       | Type    | Default | Description                                                |
| -------------------------- | ------- | ------- | ---------------------------------------------------------- |
| [data]                     | any     | {}      | Pass data to modal component                               |
| [allowCloseOnOutsideClick] | boolean | false   | The user can close the modal by clicking outside the modal |
| [containerClass]           | string  | null    | Css class name                                             |
| [header]                   | string  | null    | Header config                                              |
| [footer]                   | string  | null    | Footer config                                              |
| [width]                    | string  | ""      | Width of dialog                                            |
| [minWidth]                 | string  | ""      | Minimum width of dialog                                    |
| [maxWidth]                 | string  | ""      | Maximum width of dialog                                    |
| [height]                   | string  | ""      | Height of dialog                                           |
| [minHeight]                | string  | ""      | Minimum height of dialog                                   |
| [maxHeight]                | string  | ""      | Maximum height of dialog                                   |

## Author

💻Mohammadreza samani | FrontEnd Developer

[❤️Buy me a coffee 😉](https://www.buymeacoffee.com/mrsamani/ngxdragableresizable)
