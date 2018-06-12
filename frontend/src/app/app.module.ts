import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { PipesModule } from './pipes/pipes.module';
import { HomeModule } from './home/home.module';
import { CollectionsModule } from './collections/collections.module';
import { ComposerModule } from './composer/composer.module';
import { ExamsModule } from './exams/exams.module';
import { LoginModule } from './login/login.module';
import { RegisterModule } from './register/register.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PipesModule,
    CoreModule,
    HomeModule,
    ComposerModule,
    CollectionsModule,
    ExamsModule,
    LoginModule,
    RegisterModule,
  ],
  providers: [],
  bootstrap: [
    AppComponent,
  ]
})
export class AppModule { }
