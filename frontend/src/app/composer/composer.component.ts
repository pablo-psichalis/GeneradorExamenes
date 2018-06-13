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
      'Coleccion 1',
      'Coleccion 2',
      'Coleccion 3',
      'Coleccion 4',
      'Coleccion 5',
      'Coleccion 6',
      'Coleccion 7',
      'Coleccion 8'
    ];
    // tslint:disable:max-line-length
    this.examItems = [{
      difficulty: 3,
      points: 3,
      type: 'Test',
      content: 'Pregunta de test asdasdasda 1',
      expanded: false
    },
    {
      difficulty: 2,
      points: 2,
      type: 'Test',
      content: 'Pregunta de test dasdajida sdajisda 2',
      expanded: false
    },
    {
      difficulty: 1,
      points: 2,
      type: 'Ejercicio',
      content: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?',
      expanded: false
    },
    {
      difficulty: 3,
      points: 2,
      type: 'Problema',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
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
