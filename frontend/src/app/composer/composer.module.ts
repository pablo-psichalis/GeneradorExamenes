import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComposerComponent } from './composer.component';
import { PipesModule } from '../pipes/pipes.module';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';

@NgModule({
  imports: [
    CommonModule,
    PipesModule,
    QuillModule,
    FormsModule,
  ],
  declarations: [ComposerComponent]
})
export class ComposerModule { }
