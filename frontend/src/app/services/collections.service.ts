import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { ErrorService } from './error.service';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class CollectionsService {

  private URLAPI: String;

  constructor(
    private http: HttpClient,
    private errorService: ErrorService,
    private loginService: LoginService,
  ) {
    this.URLAPI = `http://localhost:${environment.dbport}/api/`;
  }

  public getCollections(): Promise<any> {
    return this.http.get(this.URLAPI + 'collections', this.loginService.getHttpOptions()).toPromise()
      .then(res => res)
      .catch(error => this.errorService.throwError(error, this));
  }

  public postCollection(collection: any): Promise<any> {
    return this.http.post(this.URLAPI + 'collections', collection, this.loginService.getHttpOptions()).toPromise()
      .then(res => res)
      .catch(error => this.errorService.throwError(error, this));
  }

  public putCollection(collection: any): Promise<any> {
    return this.http.put(this.URLAPI + 'collections/' + collection._id, collection, this.loginService.getHttpOptions()).toPromise()
      .then(res => res)
      .catch(error => this.errorService.throwError(error, this));
  }

  public deleteCollection(id: String): Promise<any> {
    return this.http.delete(this.URLAPI + 'collections/' + id, this.loginService.getHttpOptions()).toPromise()
      .then(res => res)
      .catch(error => this.errorService.throwError(error, this));
  }
}
