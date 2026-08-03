import { TemplateRef } from "@angular/core";

export class NgxDatePickerConfig {
    previousButtonTemplate?: TemplateRef<any>;
    nextButtonTemplate?: TemplateRef<any>;
    caretDownIconTemplate?: TemplateRef<any>;

    todayButton = true;
    clearButton = true;
    clearButtonText = 'Clear';
    todayButtonText = 'Today';
}