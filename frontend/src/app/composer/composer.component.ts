import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-composer',
  templateUrl: './composer.component.html',
  styleUrls: ['./composer.component.css']
})
export class ComposerComponent implements OnInit {

  public previewDimensions = {};
  public paperDimensions = {};

  constructor() { }

  public htmlProps;

  ngOnInit() {

    this.previewDimensions = {
      height: 0,
      width: 0
    }

    const baseDimension = window.innerWidth * 0.55;

    this.paperDimensions = {
      width: baseDimension,
      height: baseDimension * Math.sqrt(2)
    }

    this.onResize(null);

  }

  public onResize(event) {
    this.previewDimensions = {
      height: window.innerHeight
        - document.querySelector("app-header div").clientHeight
        - document.querySelector("app-footer div").clientHeight
        - document.querySelector("div.b-window-header").clientHeight,
      width: window.innerWidth
        - document.querySelector("div.section-left").clientWidth * 2
    }
  }

}
