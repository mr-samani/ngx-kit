import { IComponent } from './IComponent';

export interface ICategory {
  open?: boolean;
  name: string;
  items: IComponent[];
}
