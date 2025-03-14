import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { authInterceptor } from './app/interceptors/auth.interceptor';
import { routes } from './app/app.routes';
import { IMqttServiceOptions, MqttModule } from 'ngx-mqtt';
import { importProvidersFrom } from '@angular/core';
export const connection: IMqttServiceOptions = {
  hostname: 'localhost',
  port: 8083,
  path: '/mqtt',
  clean: true, 
  connectTimeout: 4000, 
  reconnectPeriod: 4000, 
  connectOnCreate: false,
}
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withHashLocation()),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    importProvidersFrom(MqttModule.forRoot(connection)),
  ]
}).catch(err => console.error(err));