import { Component, OnInit } from '@angular/core';
import { SharedService } from './services/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public title = 'app';

  private isLogged: boolean;
  private isAdmin: boolean;

  constructor(
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.isLogged = false;
    this.isAdmin = true;

    this.sharedService.emitLogin({
      isLogged: this.isLogged,
      isAdmin: this.isAdmin
    });

  }
}
