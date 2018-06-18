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
import { SharedService } from './services/shared.service';
import { LoginService } from './services/login.service';
import { HttpClientModule } from '@angular/common/http';
import { UsersService } from './services/users.service';
import { ErrorService } from './services/error.service';
import { CollectionsService } from './services/collections.service';
import { ExamsService } from './services/exams.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    HttpClientModule,
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
  providers: [
    SharedService,
    ErrorService,
    LoginService,
    UsersService,
    CollectionsService,
    ExamsService,
  ],
  bootstrap: [
    AppComponent,
  ]
})
export class AppModule { }
