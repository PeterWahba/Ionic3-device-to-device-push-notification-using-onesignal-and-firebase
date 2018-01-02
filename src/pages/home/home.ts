import { OnesignalProvider } from './../../providers/onesignal/onesignal';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import firebase from 'firebase';
import { OneSignal } from '@ionic-native/onesignal';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  tags: any = null
  gender: string = 'male';
  message: string = null;
  constructor(
    public navCtrl: NavController,
    public One: OneSignal,
    public onesignalProvider: OnesignalProvider
  ) {

  }


  ionViewWillEnter() {
    this.getTags();
    setTimeout(() => {
      this.getTags();
    }, 500);
  }



  //send the notification
  Send_Push_Notification_To_Available_Users() {
    let filters =
      {
        "field": "tag",
        "key": "gender",
        "relation": "=",
        "value": this.gender
      }

    this.onesignalProvider.initializeOnesignal();
    this.onesignalProvider.getOnesignalID(filters, this.message);
  }

  async getTags() {
    ///
    this.tags = await this.onesignalProvider.getTags();
    this.tags = JSON.stringify(this.tags);

    console.log(this.tags);

  }

  changeGender(selectedGenderValue: any) {
    console.log(selectedGenderValue);
    this.gender = selectedGenderValue
  }

  clearUserTags() {
    this.onesignalProvider.clearUserTags();
    this.getTags();
  }

  setUserTag(tag) {
    this.onesignalProvider.setUserTag(tag);
    this.getTags();
  }


}
