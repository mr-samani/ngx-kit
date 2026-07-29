import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FieldsType, TableCellRendererComponent } from 'ngx-kit/data-table';

@Component({
  selector: 'app-image-cell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (value()) {
      <img
        class="table-image"
        [src]="value()!"
        [alt]="alt()"
        loading="lazy"
        (error)="onImageError($event)" />
    } @else {
      <span class="image-placeholder">بدون تصویر</span>
    }
  `,
  styles: `
    .table-image {
      display: block;
      width: 56px;
      height: 40px;
      border-radius: 6px;
      object-fit: cover;
    }

    .image-placeholder {
      font-size: 12px;
      opacity: 0.6;
    }
  `,
})
export class ImageCellRenderer<T extends object> implements TableCellRendererComponent<
  string | null,
  T
> {
  readonly value = input.required<string | null>();
  readonly row = input.required<T>();
  readonly field = input.required<FieldsType<T>>();

  readonly alt = input('تصویر');

  onImageError(event: Event): void {
    const image = event.target as HTMLImageElement;

    image.style.display = 'none';
  }
}
