import { Injectable } from '@angular/core';
import { LoginService } from '../services/login.service';
import { SharedService } from './shared.service';

@Injectable()
export class ErrorService {

  constructor(
    private loginService: LoginService,
  ) { }

  public throwError(error: any, place: any) {
    if (error.status) {
      switch (error.status) {
        case 401:
          /* this.loginService.logout(); */
          break;
        default:
          this.logError('HTTP Error', error, place);
      }
    } else {
      this.logError('Code error', error, place);
    }
  }

  private logError(type: String, error: any, place: Object) {
    console.error(type + ' @ ' + place.constructor.name + ': ' + error.message);
  }

}
