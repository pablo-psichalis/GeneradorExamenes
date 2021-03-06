import { Component, OnInit } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { CollectionsService } from '../services/collections.service';
import { TouchSequence } from 'selenium-webdriver';

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
  public collectionsHeight: number;

  public oCollections: Array<any>;
  public quillModules: {};
  public quillStyle: {};

  public selectedId: number;

  public editingQId: number;
  public editingQ: any;
  public deletingQId: number;

  public editingCId: number;
  public editingC: any;
  public deletingCId: number;

  public editingOId: number;

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
    this.collectionsHeight = 0;

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
    this.oCollections = [];

    this.selectedId = -1;
    this.deletingQId = -1;
    this.deletingCId = -1;
    this.editingQId = -1;
    this.editingCId = -1;
    this.editingOId = -1;

    this.editingQ = {};
    this.editingC = {};
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
    this.collectionsHeight = this.pageHeight;
  }

  public editQuestion(id, status: boolean = true) {
    if (status) {
      this.editingQId = id;
      this.editingQ = this.oCollections[this.selectedId].questions[this.editingQId] ?
        JSON.parse(JSON.stringify(this.oCollections[this.selectedId].questions[this.editingQId])) :
        {
          statement: '',
          difficulty: 1,
          type: 'short',
          options: [],
          correct_option: 0,
          solution: ''
        };
    } else {
      this.editingQId = -1;
      this.editingOId = -1;
      this.editingQ = {
        statement: '',
        difficulty: 1,
        type: '',
        options: [],
        correct_option: 0,
        solution: ''
      };
    }
  }

  public saveQuestion() {
    this.oCollections[this.selectedId].questions[this.editingQId] = JSON.parse(JSON.stringify(this.editingQ));
    this.oCollections[this.selectedId].count = this.countQuestions(this.oCollections[this.selectedId]);
    this.collectionsService.putCollection(this.oCollections[this.selectedId]);
    this.editQuestion(null, false);
  }

  public deleteQuestion(id) {
    if (this.deletingQId === -1) {
      this.deletingQId = id;
    } else if (this.deletingQId = id) {
      this.oCollections[this.selectedId].questions.splice(id, 1);
      this.oCollections[this.selectedId].count = this.countQuestions(this.oCollections[this.selectedId]);
      this.collectionsService.putCollection(this.oCollections[this.selectedId]);
    }
  }

  private countQuestions(collection) {
    return {
      test: collection.questions.filter(x => x.type === 'test').length,
      short: collection.questions.filter(x => x.type === 'short').length,
      long: collection.questions.filter(x => x.type === 'long').length,
    };
  }

  public editCollection(id, status: boolean = true) {
    if (status) {
      this.editingCId = id;
      this.editingC = this.oCollections[id] ?
        JSON.parse(JSON.stringify(this.oCollections[id])) :
        {
          count: {
            test: 0,
            short: 0,
            long: 0
          },
          title: '',
          description: '',
          difficulty: 1,
          questions: []
        };
    } else {
      this.editingCId = -1;
      this.editingC = {
        count: {
          test: 0,
          short: 0,
          long: 0
        },
        title: '',
        difficulty: 1,
        description: '',
        questions: []
      };
    }
  }

  public saveCollection() {
    if (this.oCollections[this.editingCId]) {
      this.collectionsService.putCollection(this.editingC)
        .then(() => this.collectionsService.getCollections()
          .then(res => {
            this.oCollections = res;
            this.editCollection(null, false);
          })
        );
    } else {
      this.collectionsService.postCollection(this.editingC)
        .then(() => this.collectionsService.getCollections()
          .then(res => {
            this.oCollections = res;
            this.selectedId = this.editingCId;
            this.editCollection(null, false);
          })
        );
    }
  }

  public deleteCollection(id) {
    if (this.deletingCId === -1) {
      this.deletingCId = id;
    } else if (this.deletingCId === id) {
      const colId = this.oCollections[id]._id;
      this.initializeValues();
      this.collectionsService.deleteCollection(colId)
      .then(() => this.collectionsService.getCollections()
          .then(res => this.oCollections = res)
      );
    }
  }
}
