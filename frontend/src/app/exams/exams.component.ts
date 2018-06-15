import { Component, OnInit } from '@angular/core';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-exams',
  templateUrl: './exams.component.html',
  styleUrls: ['./exams.component.css']
})
export class ExamsComponent implements OnInit {

  public isLogged: boolean;
  public isAdmin: boolean;

  public pageWidth: number;
  constructor(
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
    this.onResize(null);
  }

  public onResize(event) {
    this.pageWidth = window.innerHeight
      - document.querySelector('app-header div').clientHeight
      - document.querySelector('app-footer div').clientHeight
      - document.querySelector('div.b-window-header').clientHeight;
  }
}
