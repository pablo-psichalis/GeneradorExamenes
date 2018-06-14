import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { UsersService } from '../../services/users.service';
import { ErrorService } from '../../services/error.service';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public isLogged: boolean;
  public isAdmin: boolean;

  public loggedUser: {
    _id: string,
    username: string
  };

  public showMenu: boolean;

  constructor(
    private sharedService: SharedService,
    private usersSerivice: UsersService,
    private errorService: ErrorService,
    private loginService: LoginService,
  ) { }

  ngOnInit() {
    this.sharedService.loginEmitted.subscribe(data => {
      if (data !== 'NOT_INIT') {
        this.sharedService.emitStatus('UNLOADED');
        this.isLogged = data.isLogged;
        this.isAdmin = data.isAdmin;
        this.loadComponent();
      }
    });
  }

  private loadComponent() {
    this.loggedUser = {
      _id: '',
      username: ''
    };
    this.showMenu = false;

    if (this.isLogged) {
      this.usersSerivice.getUser()
        .then(res => {
          this.loggedUser = res;
        })
        .catch(err => this.errorService.throwError(err, this));
    }
  }

  public logout() {
    this.loginService.logout();
  }

}
