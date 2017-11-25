import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {AppComponent} from './app.component';
import {MatIconModule} from '@angular/material/icon';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [AppComponent],
  imports: [
    HttpClientModule, BrowserModule, MatToolbarModule, MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}