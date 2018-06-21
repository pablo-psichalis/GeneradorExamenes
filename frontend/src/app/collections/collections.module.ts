import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollectionsComponent } from './collections.component';
import { QuillModule } from 'ngx-quill';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    QuillModule,
    FormsModule,
  ],
  declarations: [CollectionsComponent]
})
export class CollectionsModule { }
