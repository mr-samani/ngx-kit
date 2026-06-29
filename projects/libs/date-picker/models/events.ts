export class MsEvents<DateInput = Date> {
    title?: string;
    start!: DateInput;
    end?: DateInput;
}


export class MsEventViewer extends MsEvents {
    left?: number;
    top?: number
    right?: number;
    bottom?: number;
}