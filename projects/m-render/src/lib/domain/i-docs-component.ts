import { Type } from '@angular/core';

export interface IDocsComponent {

  tag: string;

  component: Type<any> | Promise<any>;
}
