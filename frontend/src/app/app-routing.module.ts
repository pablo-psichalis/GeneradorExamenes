import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ComposerComponent } from './composer/composer.component';
import { CollectionsComponent } from './collections/collections.component';
import { ExamsComponent } from './exams/exams.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'composer', component: ComposerComponent },
  { path: 'collections', component: CollectionsComponent },
  { path: 'exams', component: ExamsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
