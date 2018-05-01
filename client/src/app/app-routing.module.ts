import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AppComponent} from './app.component'
import {PageComponent} from './page/page.component'
import {AccComponent} from './acc/acc.component'

const routes : Routes = [
  {
    path: 'page', component: PageComponent
  },
  {
    path: '', component: AccComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}