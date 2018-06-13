import { Component, OnInit } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { UsersService } from '../services/users.service';
import { ErrorService } from '../services/error.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public isLogged: boolean;
  public isAdmin: boolean;

  public loggedUser: {
    _id: string,
    username: string
  };

  public pageHeight: number;

  constructor(
    private sharedService: SharedService,
    private usersSerivice: UsersService,
    private errorService: ErrorService,
  ) { }

  ngOnInit() {
    this.pageHeight = 0;
    this.onResize(null);
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
    this.usersSerivice.getUser()
      .then(res => {
        this.loggedUser = res;
        this.sharedService.emitStatus('LOADED');
      })
      .catch(err => this.errorService.throwError(err, this));
  }

  public onResize(event) {
    this.pageHeight = window.innerHeight
      - document.querySelector('app-header div').clientHeight
      - document.querySelector('app-footer div').clientHeight;
  }

}
