import { Component, OnInit } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { CollectionsService } from '../services/collections.service';
import { ExamsService } from '../services/exams.service';

@Component({
  selector: 'app-composer',
  templateUrl: './composer.component.html',
  styleUrls: ['./composer.component.css']
})
export class ComposerComponent implements OnInit {

  public isLogged: boolean;
  public isAdmin: boolean;

  public quillModules: any;
  public quillStyle: any;

  public previewDimensions: {
    width: number,
    height: number
  };
  public paperDimensions: {
    width: number,
    height: number
  };

  public addingOverlay: boolean;

  public types: {
    test: String,
    short: String,
    long: String
  };
  public oCollections: Array<any>;
  public editingCollections: Array<any>;
  public typesCount: {
    test: number,
    short: number,
    long: number
  };
  public generationOptions: {
    test: {
      count: number,
      points: number
    },
    short: {
      count: number,
      points: number
    },
    long: {
      count: number,
      points: number
    },
    difficulty: number
  };
  public generating: boolean;

  public exam: {
    title: string,
    date: string,
    description: string,
    subject: string,
    school_name: string,
    sections: Array<any>
  };

  public editingQId: {
    sId: number,
    qId: number
  };
  public editingQ: any;
  public deletingQId: {
    sId: number,
    qId: number
  };

  constructor(
    private sharedService: SharedService,
    private collectionsService: CollectionsService,
    private examsService: ExamsService,
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
    this.types = {
      test: 'Test',
      short: 'Ejercicio',
      long: 'Problema'
    };
    this.addingOverlay = false;
    this.oCollections = [];
    this.editingCollections = [];
    this.typesCount = {
      test: 0,
      short: 0,
      long: 0
    };
    this.generationOptions = {
      test: {
        count: 0,
        points: 0
      },
      short: {
        count: 0,
        points: 0
      },
      long: {
        count: 0,
        points: 0
      },
      difficulty: 0
    };
    this.generating = false;

    this.previewDimensions = {
      height: 0,
      width: 0
    };
    this.paperDimensions = {
      height: 0,
      width: 0
    };

    this.exam = {
      title: '',
      date: '',
      description: '',
      subject: '',
      school_name: '',
      sections: []
    };

    this.editingQId = {
      sId: -1,
      qId: -1
    };
    this.editingQ = {};
    this.deletingQId = {
      sId: -1,
      qId: -1
    };

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
    this.addingOverlay = false;
    this.oCollections = [];
    this.editingCollections = [];
    this.typesCount = {
      test: 0,
      short: 0,
      long: 0
    };
    this.generationOptions = {
      test: {
        count: 0,
        points: 0
      },
      short: {
        count: 0,
        points: 0
      },
      long: {
        count: 0,
        points: 0
      },
      difficulty: 0
    };
    this.exam = {
      title: '',
      date: '',
      description: '',
      subject: '',
      school_name: '',
      sections: []
    };
    this.generating = false;

    this.editingQId = {
      sId: -1,
      qId: -1
    };
    this.editingQ = {};
    this.deletingQId = {
      sId: -1,
      qId: -1
    };

    this.onResize(null);

    this.collectionsService.getCollections()
      .then(res => this.oCollections = res)
      .then(() => this.oCollections.map(x => x.added = false))
      .then(() => this.sharedService.emitStatus('LOADED'));
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
    this.paperDimensions = {
      width: this.previewDimensions.width * 0.8,
      height: this.previewDimensions.width * 0.8 * Math.sqrt(2)
    };
  }

  public editCollections(action: boolean = true) {
    if (!this.addingOverlay) {
      this.addingOverlay = true;
      this.editingCollections = JSON.parse(JSON.stringify(this.oCollections));
    } else {
      this.addingOverlay = false;
      if (action) {
        this.oCollections = JSON.parse(JSON.stringify(this.editingCollections));
        this.typesCount = {
          test: 0,
          short: 0,
          long: 0
        };
        this.oCollections.forEach(x => {
          if (x.added) {
            this.typesCount.test += x.count.test;
            this.typesCount.short += x.count.short;
            this.typesCount.long += x.count.long;
          }
        });
      }
      this.editingCollections = [];
    }
  }

  public isAdded(x): boolean {
    return x.added === true;
  }

  public generateExam() {
    const collectionsArray = [];
    this.generating = true;
    this.oCollections.filter(x => x.added).forEach(y => { collectionsArray.push(y._id); });
    this.examsService.generateExam({
      collections: collectionsArray,
      test: this.generationOptions.test,
      short: this.generationOptions.short,
      long: this.generationOptions.long
    })
      .then(res => {
        this.exam = res;
        this.generating = false;
      });
  }

  public numToLetter(x) {
    return String.fromCharCode(x + 97);
  }

  public calcTotalPoints(x) {
    let out = 0;
    x.forEach(y => out += y.max_points);
    return Math.round(out * 100) / 100;
  }

  public print() {
    const mywindow = window.open('', 'new div', 'height=400,width=600');
    mywindow.document.write('<html><head><title></title>');
    mywindow.document.write('<base href="/">');
    Array.from(document.getElementsByTagName('style')).forEach(e => {
      mywindow.document.write('<style>' + e.innerHTML + '</style>');
    });
    mywindow.document.write('</head><body>');
    mywindow.document.write(document.querySelector('div.paper').innerHTML);
    // tslint:disable:max-line-length
    /* mywindow.document.write('<script type="text/javascript" src="runtime.js" media="print">');
    mywindow.document.write('</script><script type="text/javascript" src="polyfills.js" media="print"></script>');
    mywindow.document.write('<script type="text/javascript" src="styles.js" media="print"></script>');
    mywindow.document.write('<script type="text/javascript" src="vendor.js" media="print"></script>');
    mywindow.document.write('<script type="text/javascript" src="main.js" media="print"></script>'); */
    mywindow.document.write('</body>');
    mywindow.print();
    mywindow.close();
  }

}
