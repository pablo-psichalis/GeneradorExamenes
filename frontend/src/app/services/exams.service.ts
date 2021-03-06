import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { ErrorService } from './error.service';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class ExamsService {

  private URLAPI: String;

  constructor(
    private http: HttpClient,
    private errorService: ErrorService,
    private loginService: LoginService,
  ) {
    this.URLAPI = `http://localhost:${environment.dbport}/api/`;
  }

  public getExams(): Promise<any> {
    return this.http.get(this.URLAPI + 'exams', this.loginService.getHttpOptions()).toPromise()
      .then(res => res)
      .catch(error => this.errorService.throwError(error, this));
  }

  public getExam(id: String): Promise<any> {
    return this.http.get(this.URLAPI + 'exams/' + id, this.loginService.getHttpOptions()).toPromise()
      .then(res => res)
      .catch(error => this.errorService.throwError(error, this));
  }

  public postExam(exam: any): Promise<any> {
    return this.http.post(this.URLAPI + 'exams', exam, this.loginService.getHttpOptions()).toPromise()
      .then(res => res)
      .catch(error => this.errorService.throwError(error, this));
  }

  public putExam(id: String, exam: any): Promise<any> {
    return this.http.put(this.URLAPI + 'exams/' + id, exam, this.loginService.getHttpOptions()).toPromise()
      .then(res => res)
      .catch(error => this.errorService.throwError(error, this));
  }

  public deleteExam(id: String): Promise<any> {
    return this.http.delete(this.URLAPI + 'exams/' + id, this.loginService.getHttpOptions()).toPromise()
      .then(res => res)
      .catch(error => this.errorService.throwError(error, this));
  }

  public generateExam(data: any): Promise<any> {
    return this.http.post(this.URLAPI + 'exams/generate', data, this.loginService.getHttpOptions()).toPromise()
      .then(res => res)
      .catch(error => this.errorService.throwError(error, this));
  }
}
