import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private emitStatusSource: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private emitLoginSource: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  public statusEmitted = this.emitStatusSource.asObservable();
  public loginEmitted = this.emitLoginSource.asObservable();

  public loginErr: boolean;

  public emitStatus(data: any) {
    this.emitStatusSource.next(data);
  }
  public emitLogin(data: any) {
    this.emitLoginSource.next(data);
  }

  constructor(private router: Router) {
    this.emitStatusSource.next('NOT_INIT');
    this.emitLoginSource.next('NOT_INIT');
  }

}
