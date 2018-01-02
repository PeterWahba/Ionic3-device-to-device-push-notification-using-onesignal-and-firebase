import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { OneSignal } from '@ionic-native/onesignal';
import { Platform } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { AppConfig } from '../../app/app-config';

@Injectable()
export class OnesignalProvider {

  constructor(
    public One: OneSignal,
    public platform: Platform,
    private http: Http,
    public appConfig: AppConfig


  ) {
    if (this.platform.is('cordova')) {

      this.initializeOnesignal()
    }
  }


  initializeOnesignal() {

    this.One.startInit(this.appConfig.OneSignal_App_ID, this.appConfig.google_project_number);
    this.One.inFocusDisplaying(this.One.OSInFocusDisplayOption.Notification);
    this.One.setSubscription(true);
    this.One.enableVibrate(true);

    this.One.handleNotificationReceived().subscribe((data) => {
      // handle received here how you wish.
      // alert(data)
      alert('New Notification received !!!')
    });
    this.One.handleNotificationOpened().subscribe((data) => {
      // handle opened here how you wish.
      // alert(data)
      alert('New Notification received !!!')
    });
    this.One.endInit();
  }

  getOnesignalID(data, message) {

    ///
    let enMessage: string
    if (message) {
      enMessage = message
    } else {
      enMessage = 'This is test message ...'
    }

    ///
    console.log(data);

    let reciever_ID: any;
    this.One.getIds().then(success => {
      //Update  the database with onesignal_ID

      reciever_ID = success.userId
      console.log(reciever_ID);

      ///Push The Notification
      let notificationObj: any = {
        app_id: this.appConfig.OneSignal_App_ID,
        auth_key: this.appConfig.REST_API_Key,
        include_player_ids: [reciever_ID],
        contents: { en: enMessage },
        tags: [data]
      };

      console.log(notificationObj);
      this.sendNotification(notificationObj);



    })
  }


  async sendNotification(messageData) {


    return new Promise((resolve, reject) => {
      let headers = new Headers();

      let payload = JSON.stringify(messageData);


      headers.append('Content-Type', 'application/json; charset=utf-8');
      headers.append('Authorization', 'Basic ' + this.appConfig.REST_API_Key);

      let options = new RequestOptions({ headers: headers });

      this.http.post('https://onesignal.com/api/v1/notifications', payload, options)

        .map(res => res.json()
        ).subscribe(data => {
          console.log(data);
          resolve(data)
        }, err => {
          console.log(err);
          reject(err.json());

        });
    });

  }






  getTags() {
    return new Promise((resolve, reject) => {

      this.One.getTags().then(tags => {
        console.log(tags);
        resolve(tags)

      }).catch(err => {
        console.log(err);
        reject(err.json());

      })
    });

  }

  clearUserTags() {
    this.One.deleteTag('gender');
  }

  setUserTag(tag) {
    this.One.sendTag("gender", tag);
  }
}
