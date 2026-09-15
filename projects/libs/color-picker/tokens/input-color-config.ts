import { ColorInspector } from '../contracts/ColorInspector.enum';
import  { OutputType } from '../contracts/OutputType';
import { PRESETS_COLORS } from '../utils/presets-colors';

export class NgxInputColorConfig {
  /**
   * show preset colors
   * - It will not display preset colors in simple mode.
   */
  showPresets?: boolean = true;
  presetColors?: string[] = PRESETS_COLORS;

  /** Minifi UI  */
  simpleMode?: boolean = false;
  outputType?: OutputType = 'HEX';
  defaultInspector?: ColorInspector = ColorInspector.Picker;

  useAlphaChannel?: boolean = true;
}
