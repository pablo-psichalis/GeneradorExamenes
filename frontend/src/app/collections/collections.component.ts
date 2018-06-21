import { Component, OnInit } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { CollectionsService } from '../services/collections.service';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.css']
})
// tslint:disable:max-line-length
export class CollectionsComponent implements OnInit {

  public isLogged: boolean;
  public isAdmin: boolean;

  public pageHeight: number;
  public previewWidth: number;

  public oCollections: Array<any>;
  public quillModules: {};
  public quillStyle: {};

  public selectedId: number;
  public deletingQId: number;
  public deletingCId: number;
  public editingQId: number;
  public editingCId: number;
  public editingOId: number;

  public editingQ: any;

  constructor(
    private sharedService: SharedService,
    private collectionsService: CollectionsService,
  ) { }

  ngOnInit() {
    this.quillModules = {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],

        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
        [{ 'align': [] }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent

        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [false, 5, 4, 3, 2, 1] }],

        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        ['clean'],                                         // remove formatting button
        ['image']                         // link and image, video
      ]
    };
    this.quillStyle = {
      'height': 'auto',
      'min-height': '5rem'
    };

    this.pageHeight = 0;
    this.previewWidth = 0;

    this.selectedId = -1;
    this.deletingQId = -1;
    this.deletingCId = -1;
    this.editingQId = -1;
    this.editingCId = -1;
    this.editingOId = -1;

    this.editingQ = {};

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

  public editQuestion(id, status: boolean = true) {
    if (status) {
      this.editingQId = id;
      this.editingQ = JSON.parse(JSON.stringify(this.oCollections[this.selectedId].questions[this.editingQId]));
    } else {
      this.editingQId = -1;
      this.editingOId = -1;
      this.editingQ = {
        statement: '',
        difficulty: 0,
        type: '',
        options: [],
        correct_option: 0,
        solution: ''
      };
    }
  }

  public saveQuestion() {
    this.oCollections[this.selectedId].questions[this.editingQId] = JSON.parse(JSON.stringify(this.editingQ));
    this.editQuestion(null, false);
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
