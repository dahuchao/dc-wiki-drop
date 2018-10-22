import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module'
import {PageService} from './page/page.service';

import {
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatMenuModule,
  MatSidenavModule,
  MatButtonToggleModule,
  MatCardModule
} from '@angular/material';
import { PageComponent } from './page/page.component';
import { AccComponent } from './acc/acc.component';

@NgModule({
  declarations: [
    AppComponent, 
    PageComponent, 
    AccComponent
  ],
  imports: [
    HttpClientModule,
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatButtonToggleModule,
    MatCardModule,
    // MarkdownModule.forRoot(),
    // LMarkdownEditorModule
  ],
  providers: [
    PageService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}
