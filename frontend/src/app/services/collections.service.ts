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
  private httpOptions: any;

  constructor(
    private http: HttpClient,
    private errorService: ErrorService,
    private loginService: LoginService,
  ) {
    this.URLAPI = `http://${environment.dbip ? environment.dbip : 'localhost'}:3000/`;
    this.httpOptions = this.loginService.getHttpOptions();
  }

  public getCollections(): Promise<any> {
    return this.http.get(this.URLAPI + 'collections', this.httpOptions).toPromise()
      .then(res => res)
      .catch(error => this.errorService.throwError(error, this));
  }

  public getCollection(id: String): Promise<any> {
    return this.http.get(this.URLAPI + 'collections/' + id, this.httpOptions).toPromise()
      .then(res => res)
      .catch(error => this.errorService.throwError(error, this));
  }

  public postCollection(collection: any): Promise<any> {
    return this.http.post(this.URLAPI + 'collections', collection, this.httpOptions).toPromise()
      .then(res => res)
      .catch(error => this.errorService.throwError(error, this));
  }

  public putCollection(id: String, collection: any): Promise<any> {
    return this.http.put(this.URLAPI + 'collections/' + id, collection, this.httpOptions).toPromise()
      .then(res => res)
      .catch(error => this.errorService.throwError(error, this));
  }

  public deleteCollection(id: String): Promise<any> {
    return this.http.delete(this.URLAPI + 'collections/' + id, this.httpOptions).toPromise()
      .then(res => res)
      .catch(error => this.errorService.throwError(error, this));
  }
}
