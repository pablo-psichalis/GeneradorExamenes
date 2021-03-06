import * as sha1 from 'sha1';
import { Component, OnInit } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { LoginService } from '../services/login.service';
import { ErrorService } from '../services/error.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public pageHeight: number;

  public formDetails: {
    username: String;
    password: String;
  };

  public error: String;
  public loading: boolean;

  constructor(
    private loginService: LoginService,
    private sharedService: SharedService,
    private errorService: ErrorService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.formDetails = {
      username: '',
      password: ''
    };
    this.pageHeight = 0;
    this.onResize(null);

    this.sharedService.loginEmitted.subscribe(data => {
      if (data !== 'NOT_INIT') {
        this.sharedService.emitStatus('UNLOADED');
        if (data.isLogged) {
          this.router.navigate(['/']);
        } else {
          this.loadComponent();
        }
      }
    });
  }

  private loadComponent() {
    this.error = '';
    this.loading = false;
    this.sharedService.emitStatus('LOADED');
  }

  public onResize(event) {
    this.pageHeight = window.innerHeight
      - document.querySelector('app-header div').clientHeight
      - document.querySelector('app-footer div').clientHeight;
  }

  public login() {
    this.error = '';
    if (this.formDetails.username && this.formDetails.password) {
      this.loading = true;
      const data = {
        username: this.formDetails.username,
        password: sha1(this.formDetails.password)
      };
      this.loginService.login(data)
        .then(res => {
          if (res.status === 401) {
            this.error = 'Credenciales inválidas';
          } else if (res.status === 500) {
            this.error = 'Error de servidor';
          } else if (res.status !== 201) {
            this.error = 'Sin conexión';
          } else {
            this.router.navigate(['/']);
          }
          this.loading = false;
        })
        .catch(err => this.errorService.throwError(err, this));
    } else if (!this.formDetails.username && !this.formDetails.password) {
      this.error = 'Usuario y contraseña no pueden estar vacíos';
    } else if (!this.formDetails.username) {
      this.error = 'Usuario no puede estar vacío';
    } else if (!this.formDetails.password) {
      this.error = 'Contraseña no puede estar vacía';
    }
  }
}
