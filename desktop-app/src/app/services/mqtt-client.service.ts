import { inject, Injectable } from '@angular/core';
import { IMqttMessage, IMqttServiceOptions, MqttService } from 'ngx-mqtt';
import { Subscription } from 'rxjs';
import { IClientSubscribeOptions } from 'mqtt-browser';
import { connection } from '../../main';

@Injectable({
  providedIn: 'root'
})
export class MqttClientService {

  constructor(private _mqttService: MqttService) {
    this.client = _mqttService;
    this.createConnection();

  }


  private curSubscription: Subscription | undefined
  
  subscription = {
    qos: 0,
  };
  client: MqttService | undefined
  isConnection = false
  subscribeSuccess = false

  createConnection() {
    try {
      this.client?.connect(connection as IMqttServiceOptions)
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
