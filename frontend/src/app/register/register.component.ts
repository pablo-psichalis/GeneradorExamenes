import { Component, OnInit } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public isLogged: boolean;
  public isAdmin: boolean;

  public pageHeight: number;

  public formDetails: {
    username: String;
    password: String;
    password2: String;
  };

  public error: String;
  public loading: boolean;

  constructor(
    private loginService: LoginService,
    private sharedService: SharedService
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
    this.formDetails = {
      username: '',
      password: '',
      password2: ''
    };
    this.error = '';
    this.loading = false;

    this.pageHeight = 0;
    this.onResize(null);
    this.sharedService.emitStatus('LOADED');
  }

  public onResize(event) {
    this.pageHeight = window.innerHeight
      - document.querySelector('app-header div').clientHeight
      - document.querySelector('app-footer div').clientHeight;
  }

  public register() {
    this.error = '';
    if (this.formDetails.username && this.formDetails.password && this.formDetails.password === this.formDetails.password2) {
      this.loading = true;
      this.loginService.register(this.formDetails)
        .then(res => {
          if (res === 'USER_TAKEN') {
            this.error = 'Este nombre de usuario ya está registrado';
          } else if (res === 'SERVER_ERROR') {
            this.error = 'Sin conexión';
          }
          this.loading = false;
        })
        .catch();
    } else if (!this.formDetails.username && !this.formDetails.password) {
      this.error = 'Usuario y contraseña no pueden estar vacíos';
    } else if (!this.formDetails.username) {
      this.error = 'Usuario no puede estar vacío';
    } else if (!this.formDetails.password) {
      this.error = 'Contraseña no puede estar vacía';
    } else if (this.formDetails.password !== this.formDetails.password2) {
      this.error = 'Las contraseñas no coinciden';
    }
  }
}
