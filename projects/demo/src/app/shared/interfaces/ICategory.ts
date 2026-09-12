import { IAppMenu } from './IAppMenu';

export interface ICategory {
  open?: boolean;
  name: string;
  items: IAppMenu[];
}
