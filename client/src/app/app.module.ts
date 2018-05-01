import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {AppRoutingModule} from './app-routing.module'
// import { MarkdownModule } from 'ngx-markdown';
// import {LMarkdownEditorModule} from 'ngx-markdown-editor';

import {
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatMenuModule,
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
    // MarkdownModule.forRoot(),
    // LMarkdownEditorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
