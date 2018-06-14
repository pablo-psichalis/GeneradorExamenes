import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollectionsComponent } from './collections.component';
import { QuillModule } from 'ngx-quill';

@NgModule({
  imports: [
    CommonModule,
    QuillModule,
  ],
  declarations: [CollectionsComponent]
})
export class CollectionsModule { }
