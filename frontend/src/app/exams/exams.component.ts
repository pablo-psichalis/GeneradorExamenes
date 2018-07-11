import { Component, OnInit } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { ExamsService } from '../services/exams.service';

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
  public exam: {
    _id: String,
    count: {
      test: number,
      short: number,
      long: number
    }
    title: string,
    date: string,
    description: string,
    subject: string,
    school_name: string,
    sections: Array<any>
  };

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
    private examsService: ExamsService
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
    this.selectedId = -1;
  }

  private loadComponent() {
    this.showSolution = true;
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
    this.examsHeight = this.pageHeight
      - document.querySelector('div.searchbar').clientHeight;
  }

  public deleteExam(id) {
    if (this.deletingEId === -1) {
      this.deletingEId = id;
    } else if (this.deletingEId = id) {
      const exId = this.oExams[id]._id;
      this.initializeValues();
      this.examsService.deleteExam(exId).then(
        () => this.examsService.getExams()
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
}
