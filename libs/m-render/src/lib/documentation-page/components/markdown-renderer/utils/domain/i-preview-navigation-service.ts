import { InjectionToken } from "@angular/core";
import { IPreviewNavigationGroup } from "./i-preview-navigation-group";

export interface IPreviewNavigationService<T extends IPreviewNavigationGroup> {
  getNavigation(): T[];
}

export const F_PREVIEW_NAVIGATION_PROVIDER = new InjectionToken<IPreviewNavigationService<IPreviewNavigationGroup>>('F_PREVIEW_NAVIGATION_PROVIDER');
