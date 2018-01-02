import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { AngularFireDatabase } from 'angularfire2/database';

/*
  Generated class for the FirebaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FirebaseProvider {

  constructor(public afd: AngularFireDatabase) { }
  getUserProfile() {
    return this.afd.list('/UserProfile/');
  }
 
  addItem(name) {
    this.afd.list('/UserProfile/').push(name);
  }


 
  removeItem(id) {
    this.afd.list('/UserProfile/').remove(id);
  }

}
