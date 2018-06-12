import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-composer',
  templateUrl: './composer.component.html',
  styleUrls: ['./composer.component.css']
})
export class ComposerComponent implements OnInit {

  public isLogged: boolean;
  public isAdmin: boolean;

  public previewDimensions: {
    width: number,
    height: number
  };
  public paperDimensions: {
    width: number,
    height: number
  };

  public collectionItems = [];
  public examItems = [];

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

    this.collectionItems = [
      'Colección 1',
      'Colección 2',
      'Colección 3',
      'Colección 4',
      'Colección 5',
      'Colección 6',
      'Colección 7',
      'Colección 8'
    ];
    // tslint:disable:max-line-length
    this.examItems = [{
      difficulty: 3,
      points: 3,
      type: 'Test',
      content: 'asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf...',
      expanded: false
    },
    {
      difficulty: 2,
      points: 2,
      type: 'Test',
      content: 'asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf',
      expanded: false
    },
    {
      difficulty: 1,
      points: 2,
      type: 'Ejercicio',
      content: 'asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf',
      expanded: false
    },
    {
      difficulty: 3,
      points: 2,
      type: 'Problema',
      content: 'asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf asdfasdf',
      expanded: false
    }];

    this.previewDimensions = {
      height: 0,
      width: 0
    };

    const baseDimension = window.innerWidth * 0.55;
    this.paperDimensions = {
      width: baseDimension,
      height: baseDimension * Math.sqrt(2)
    };

    this.onResize(null);

  }

  public onResize(event) {
    this.previewDimensions = {
      height: window.innerHeight
        - document.querySelector('app-header div').clientHeight
        - document.querySelector('app-footer div').clientHeight
        - document.querySelector('div.b-window-header').clientHeight,
      width: window.innerWidth
        - document.querySelector('div.section-left').clientWidth * 2
    };
  }

  public expandQuestion(index: number) {
    this.examItems[index].expanded = this.examItems[index].expanded ? false : true;
  }

}
