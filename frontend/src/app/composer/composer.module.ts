import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComposerComponent } from './composer.component';
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    PipesModule,
  ],
  declarations: [ComposerComponent]
})
export class ComposerModule { }
