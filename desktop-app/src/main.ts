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

  clean: true, // Retain session
  connectTimeout: 4000, // Timeout
  reconnectPeriod: 4000, // Reconnection interval
  // Authentication information
  //clientId: 'mqttx_597046f4',
  //username: 'emqx_test',
  //password: 'emqx_test',
  //protocol: 'ws',
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