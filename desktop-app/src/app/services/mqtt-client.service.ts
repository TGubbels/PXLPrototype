import { inject, Injectable } from '@angular/core';
import { IMqttMessage, IMqttServiceOptions, MqttService } from 'ngx-mqtt';
import { Subscription } from 'rxjs';
import { IClientSubscribeOptions } from 'mqtt-browser';

@Injectable({
  providedIn: 'root'
})
export class MqttClientService {
  _snackBar: any;

  constructor(private _mqttService: MqttService) {
this.client = _mqttService;
this.createConnection();

  }


  private curSubscription: Subscription | undefined
  connection = {
    hostname: 'localhost',
    port: 8083,  // Changed from 18083 to 8083 for WebSocket
    path: '/mqtt',
    protocol: 'ws', // Enable WebSocket protocol explicitly
    clean: true,
    connectTimeout: 4000,
    reconnectPeriod: 4000,
    clientId: `mqttjs_${Math.random().toString(16).substr(2, 8)}`,
    // Enable WebSocket specific options
    wsOptions: {
      protocolId: 'MQTT',
      protocolVersion: 4
    }
  }
  subscription = {
    qos: 0,
  };


  client: MqttService | undefined
  isConnection = false
  subscribeSuccess = false

  // Create a connection
  createConnection() {
    try {
      this.client?.connect(this.connection as IMqttServiceOptions)
    } catch (error) {
      console.log('mqtt.connect error', error)
    }
    this.client?.onConnect.subscribe(() => {
      this.isConnection = true
      console.log('Connection succeeded!')
    })
    this.client?.onError.subscribe((error: any) => {
      this.isConnection = false
      console.log('Connection failed', error)
    })
    this.client?.onMessage.subscribe((packet: any) => {
      console.log(`Received message ${packet.payload.toString()} from topic ${packet.topic}`)
    })
  }

  doSubscribe(topic: string, callback: (message: any) => void) {
    const subscriptionTopic = topic;
    const { qos } = this.subscription;
  
    console.log(`Subscribing to topic: ${subscriptionTopic}`);
  
    this.curSubscription = this.client?.observe(subscriptionTopic, { qos } as IClientSubscribeOptions)
      .subscribe({
        next: (message: IMqttMessage) => {
          this.subscribeSuccess = true;
          const payload = JSON.parse(message.payload.toString());
          console.log('Received message:', payload);
            callback(payload);
        },
        error: (error) => {
          console.error('Subscription error:', error);
          this.subscribeSuccess = false;
        }
      });
  }
}
