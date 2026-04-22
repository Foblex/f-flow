import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { unregisterServiceWorkers } from './unregister-service-workers';

unregisterServiceWorkers().then((hadServiceWorker) => hadServiceWorker && location.reload());

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
