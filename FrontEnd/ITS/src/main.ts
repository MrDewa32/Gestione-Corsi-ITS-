import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { provideRouter } from '@angular/router';
import { Corso } from './app/corso/corso';
import routerConfig from './routes';

bootstrapApplication(App, appConfig, {
  providers: [
    provideRouter(routerConfig)
  ]
  
}).catch((err) => console.error(err));

