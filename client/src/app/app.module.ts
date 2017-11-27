import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {AppComponent} from './app.component';
import {MatIconModule} from '@angular/material/icon';
import {HttpClientModule} from '@angular/common/http';
// import { MarkdownModule } from 'ngx-markdown';
// import {LMarkdownEditorModule} from 'ngx-markdown-editor';

@NgModule({
  declarations: [AppComponent],
  imports: [
    HttpClientModule,
    BrowserAnimationsModule,
    BrowserModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    // MarkdownModule.forRoot(),
    // LMarkdownEditorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}