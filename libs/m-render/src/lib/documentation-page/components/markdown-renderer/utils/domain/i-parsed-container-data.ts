import { EParsedContainerType } from "./e-parsed-container-type";

export interface IParsedContainerData {

  tab: string;

  type: EParsedContainerType;

  height?: string | number;

  value: string;

  isLink?: boolean;

  language?: string;
}

