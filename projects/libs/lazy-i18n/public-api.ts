import { TrPipe } from './pipes/pipe';
import { TrDirective, TrKeyDirective } from './directives/directives';

export * from './types/types';
export { flatten, interpolate, marker } from './utils/utils';
export { HttpI18nLoader } from './loader/http-loader';
export { I18nService } from './services/i18n.service';
export { provideI18n } from './providers/provide-i18n';
export { provideI18nScope, i18nReadyGuard } from './providers/routing';
export { translateSignal, injectT } from './signals/signals';
export { TrPipe } from './pipes/pipe';
export { TrDirective, TrKeyDirective, type TrContext } from './directives/directives';

/** `imports: [TR]` brings the pipe and both directives into a standalone component. */
export const TR = [TrPipe, TrDirective, TrKeyDirective] as const;
