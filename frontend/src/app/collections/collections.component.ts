import { Component, OnInit } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { CollectionsService } from '../services/collections.service';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.css']
})
export class CollectionsComponent implements OnInit {

  public isLogged: boolean;
  public isAdmin: boolean;

  public pageHeight: number;
  public previewWidth: number;

  public oCollections: Array<any>;
  public selectedId: number;
  public deletingQId: number;
  public deletingCId: number;

  constructor(
    private sharedService: SharedService,
    private collectionsService: CollectionsService,
  ) { }

  ngOnInit() {
    this.pageHeight = 0;
    this.previewWidth = 0;
    this.selectedId = -1;
    this.deletingQId = -1;
    this.deletingCId = -1;
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
    this.collectionsService.getCollections()
      .then(res => this.oCollections = res)
      .then(() => this.sharedService.emitStatus('LOADED'));
  }

  public onResize(event) {
    this.pageHeight = window.innerHeight
      - document.querySelector('app-header div').clientHeight
      - document.querySelector('app-footer div').clientHeight
      - document.querySelector('div.b-window-header').clientHeight;
    this.previewWidth = window.innerWidth
      - document.querySelector('div.menu-left').clientWidth;
  }

  public deleteQuestion(id) {
    if (this.deletingQId === -1) {
      this.deletingQId = id;
    } else if (this.deletingQId = id) {
      // TODO
    }
  }

  public deleteCollection(id) {
    if (this.deletingCId === -1) {
      this.deletingCId = id;
    } else if (this.deletingCId = id) {
      // TODO
    }
  }
}
