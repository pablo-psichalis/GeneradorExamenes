import { Component, OnInit } from '@angular/core';
import { SharedService } from './services/shared.service';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public title = 'app';

  private isLogged: boolean;
  private isAdmin: boolean;

  private childLoaded: boolean;

  constructor(
    private loginService: LoginService,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.loginService.isLogged().then(res => {
      this.sharedService.emitLogin({
        isLogged: res,
        isAdmin: this.loginService.isAdmin()
      });
    });

    this.sharedService.loginEmitted.subscribe(data => {
      this.isLogged = data.isLogged;
      this.isAdmin = data.isAdmin;
    });

    this.sharedService.statusEmitted.subscribe(data => {
      if (data === 'LOADED') {
        this.childLoaded = true;
      } else if (data === 'UNLOADED') {
        this.childLoaded = false;
      }
    });
  }
}
