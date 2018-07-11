import { Component, OnInit } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { ExamsService } from '../services/exams.service';
import { Router } from '../../../node_modules/@angular/router';

@Component({
  selector: 'app-exams',
  templateUrl: './exams.component.html',
  styleUrls: ['./exams.component.css']
})
export class ExamsComponent implements OnInit {

  public isLogged: boolean;
  public isAdmin: boolean;

  public pageHeight: number;
  public previewWidth: number;
  public examsHeight: number;

  public oExams: Array<any>;

  public selectedId: number;

  public deletingEId: number;

  public previewDimensions: {
    width: number,
    height: number
  };
  public paperDimensions: {
    width: number,
    height: number
  };

  public showSolution: boolean;

  constructor(
    private sharedService: SharedService,
    private examsService: ExamsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.pageHeight = 0;
    this.previewWidth = 0;
    this.examsHeight = 0;

    this.initializeValues();

    this.sharedService.loginEmitted.subscribe(data => {
      if (data !== 'NOT_INIT') {
        this.sharedService.emitStatus('UNLOADED');
        this.isLogged = data.isLogged;
        this.isAdmin = data.isAdmin;
        this.loadComponent();
      }
    });
  }

  private initializeValues() {
    this.oExams = [];
    this.selectedId = -1;
    this.deletingEId = -1;

    this.showSolution = false;
    this.previewDimensions = {
      width: 0,
      height: 0
    };
    this.paperDimensions = {
      width: 0,
      height: 0
    };
  }

  private loadComponent() {
    this.showSolution = false;
    this.onResize(null);

    this.examsService.getExams()
      .then(res => this.oExams = res)
      .then(() => this.sharedService.emitStatus('LOADED'));
  }

  public onResize(event) {
    this.pageHeight = window.innerHeight
      - document.querySelector('app-header div').clientHeight
      - document.querySelector('app-footer div').clientHeight
      - document.querySelector('div.b-window-header').clientHeight;
    this.examsHeight = this.pageHeight;

    this.previewDimensions = {
      height: window.innerHeight
        - document.querySelector('app-header div').clientHeight
        - document.querySelector('app-footer div').clientHeight
        - document.querySelector('div.b-window-header').clientHeight,
      width: window.innerWidth
        - document.querySelector('div.menu-left').clientWidth
    };
    this.paperDimensions = {
      width: this.previewDimensions.width * 0.8,
      height: this.previewDimensions.width * 0.8 * Math.sqrt(2)
    };
  }

  public deleteExam(id) {
    if (this.deletingEId === -1) {
      this.deletingEId = id;
    } else if (this.deletingEId === id) {
      const exId = this.oExams[id]._id;
      this.initializeValues();
      this.examsService.deleteExam(exId)
        .then(() => this.examsService.getExams()
          .then(res => this.oExams = res)
        );
    }
  }

  public calcTotalPoints(x) {
    let out = 0;
    x.forEach(y => out += y.max_points);
    return Math.round(out * 100) / 100;
  }

  public numToLetter(x) {
    return String.fromCharCode(x + 97);
  }

  public openInComposer() {
    this.router.navigate(['/composer'], { queryParams: { load_exam: this.oExams[this.selectedId]._id } });
  }
}
