import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { SharedService } from './shared.service';
import { ErrorService } from './error.service';

const URLAPI = `http://${environment.dbip ? environment.dbip : 'localhost'}:3000/`;
const token_key = 'genEx_tkn';
const id_key = 'genEx_id';
const admin_key = 'genEx_adminTkn';
const roles = {
  admin: '1',
  user: undefined,
};

@Injectable()
export class LoginService {

  constructor(
    private http: HttpClient,
    private sharedService: SharedService,
  ) { }

  public login(data): Promise<any> {
    if (!data.username || !data.password) {
      return undefined;
    }
    return this.http.post(URLAPI + 'login', data).toPromise()
      .then((response: any) => {
        localStorage.setItem(token_key, response.token);
        localStorage.setItem(id_key, response.user._id);
        localStorage.setItem(admin_key, response.user.role);
        this.sharedService.emitLogin({
          isLogged: true,
          isAdmin: response.user.role ? true : false,
        });
        return response;
      }).catch(err => err);
  }

  public register(data): Promise<any> {
    return this.http.post(URLAPI + 'users/register', data).toPromise()
      .then((response: any) => {
        return response;
      }).catch(err => err);
  }

  public logout() {
    localStorage.removeItem(token_key);
    localStorage.removeItem(id_key);
    this.sharedService.emitLogin({
      isLogged: false,
      isAdmin: false
    });
  }


  public getToken() {
    return localStorage.getItem(token_key);
  }

  public getId() {
    return localStorage.getItem(id_key);
  }

  public isLogged() {
    const httpOptions = this.getHttpOptions();
    return this.http.get(URLAPI + 'login/validToken', httpOptions).toPromise()
      .then((res: any) => {
        if (res.status === 200) { return true; }
        return false;
      })
      .catch((res: any) => {
        if (res.status === 200) { return true; }
        return false;
      });
  }

  public getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': this.getToken()
      })
    };
  }

  public isAdmin() {
    switch (localStorage.getItem(admin_key)) {
      case roles.admin:
        return true;
      default:
        return false;
    }
  }
}
