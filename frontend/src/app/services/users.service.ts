import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { LoginService } from './login.service';
import { HttpClient } from '@angular/common/http';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private loginService: LoginService,
    private errorService: ErrorService,
    private http: HttpClient
  ) { }
  private urlBase = `http://localhost:${environment.dbport}/api/`;

  public getUser(id: String = ''): Promise<any> {
    const url = `${this.urlBase}users${id ? '/' + id : ''}`;
    return this.http
      .get(url, this.loginService.getHttpOptions())
      .toPromise()
      .then((element: any) => {
        return element;
      })
      .catch(err => this.errorService.throwError(err, this));
  }
}
