export interface IAppMenu {
  title: string;
  description?: string;
  imageDark?: string;
  imageLight?: string;
  url?: string;
  icon?: string;

  fragments?: IFragmentsMenu[];
}

export interface IFragmentsMenu {
  id: string;
  title: string;
  description?: string;
  icon?: string;
}
