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

  public editingQId: {
    sId: number,
    qId: number
  };
  public editingQ: any;
  public editingOId: any;
  public editingQParent: number;
  public deletingQId: {
    sId: number,
    qId: number
  };
  public deletingSId: number;

  public showSolution: boolean;

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
      difficulty: 2
    };
    this.exam = {
      _id: '',
      count: {
        test: 0,
        short: 0,
        long: 0
      },
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
    this.editingQParent = 0;
    this.editingOId = -1;
    this.deletingQId = {
      sId: -1,
      qId: -1
    };
    this.deletingSId = -1;
    this.showSolution = false;

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

  public editQuestion(sId, qId, status: boolean = true) {
    if (status) {
      this.editingQId = {
        qId: qId,
        sId: sId
      };
      if (this.exam.sections[this.editingQId.sId].questions[this.editingQId.qId]) {
        this.editingQ = JSON.parse(JSON.stringify(this.exam.sections[this.editingQId.sId].questions[this.editingQId.qId]));
        this.editingQParent = sId;
      } else {
        this.editingQ = {
          statement: '',
          difficulty: 1,
          type: 'short',
          options: [],
          correct_option: 0,
          solution: '',
        };
        this.editingQParent = 0;
      }
    } else {
      this.editingQId = {
        qId: -1,
        sId: -1
      };
      this.editingOId = -1;
      this.editingQ = {
        statement: '',
        difficulty: 1,
        type: '',
        options: [],
        correct_option: 0,
        solution: '',
      };
      this.editingQParent = 0;
    }
  }

  public saveQuestion() {
    if (this.editingQId.sId === this.editingQParent) {
      this.exam.sections[this.editingQId.sId].questions[this.editingQId.qId] = JSON.parse(JSON.stringify(this.editingQ));
    } else {
      this.exam.sections[this.editingQId.sId].questions.splice(this.editingQId.qId, 1);
      this.exam.sections[this.editingQParent].questions.push(JSON.parse(JSON.stringify(this.editingQ)));
    }
    this.recalculateCount();
    this.editQuestion(null, null, false);
  }

  public deleteQuestion(sId, qId) {
    if (this.deletingQId.qId === -1 && this.deletingQId.sId === -1) {
      this.deletingQId = {
        qId: qId,
        sId: sId
      };
      setTimeout(() => {
        this.deletingQId = {
          qId: -1,
          sId: -1
        };
      }, 2000);
    } else if (this.deletingQId.qId === qId && this.deletingQId.sId === sId) {
      this.exam.sections[this.deletingQId.sId].questions.splice(this.deletingQId.qId, 1);
      this.recalculateCount();
      this.deletingQId = {
        qId: -1,
        sId: -1
      };
    }
  }

  public deleteSection(id) {
    if (this.deletingSId === -1) {
      this.deletingSId = id;
      setTimeout(() => {
        this.deletingSId = -1;
      }, 2000);
    } else if (this.deletingSId === id) {
      this.exam.sections.splice(id, 1);
      this.recalculateCount();
      this.deletingSId = -1;
    }
  }

  private recalculateCount() {
    const out = {
      test: 0,
      short: 0,
      long: 0
    };
    this.exam.sections.forEach(s => {
      out.test += s.questions.filter(x => x.type === 'test').length;
      out.short += s.questions.filter(x => x.type === 'short').length;
      out.long += s.questions.filter(x => x.type === 'long').length;
    });
    this.exam.count = out;
  }

  public calculateAssignablePoints() {
    let out = 10;
    this.exam.sections.forEach((s, is) => {
      s.questions.forEach((q, iq) => {
        if (is !== this.editingQId.sId || iq !== this.editingQId.qId) {
          out -= q.max_points;
        }
      });
    });
    return Math.round(out * 100) / 100;
  }

}
