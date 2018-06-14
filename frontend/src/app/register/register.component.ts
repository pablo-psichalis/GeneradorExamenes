import * as sha1 from 'sha1';
import { Component, OnInit } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';

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
    username: string;
    password: string;
    password2: string;
  };

  public error: string;
  public loading: boolean;

  constructor(
    private loginService: LoginService,
    private sharedService: SharedService,
    private router: Router,
  ) { }

  ngOnInit() {
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
      const data = {
        username: this.formDetails.username,
        password: sha1(this.formDetails.password)
      };
      this.loginService.register(data)
        .then(res => {
          if (res.status === 409) {
            this.error = 'Este nombre de usuario ya está registrado';
          } else if (res.status === 500) {
            this.error = 'Error de servidor';
          } else if (res.status !== 201) {
            this.error = 'Sin conexión';
          } else {
            this.router.navigate(['/login']);
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
