import { bootstrapApplication } from '@angular/platform-browser';
import {
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
  PreloadAllModules
} from '@angular/router';

import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import {
  provideHttpClient,
  withInterceptors
} from '@angular/common/http';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { authInterceptor } from './app/core/interceptors/auth-interceptor';
import { addIcons } from 'ionicons';
import {constructOutline, gridOutline, logOutOutline, notificationsOutline} from 'ionicons/icons';

addIcons({
  'log-out-outline': logOutOutline,
  'grid-outline': gridOutline,
  'construct-outline': constructOutline,
  'notifications-outline': notificationsOutline
});

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },

    provideIonicAngular(),

    provideRouter(routes, withPreloading(PreloadAllModules)),

    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
  ],
});
