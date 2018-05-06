import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import {Page} from './page';
import {PageService} from '../page.service';

@Component({selector: 'app-page', templateUrl: './page.component.html', styleUrls: ['./page.component.css']})
export class PageComponent implements OnInit {
  edition : boolean = false
  page : string
  pagehtml : string
  constructor(
    private servicePage: PageService,
    private route : ActivatedRoute, 
    private http : HttpClient
  ) {}

  ngOnInit() {
    this
      .route
      .paramMap
      .map((params : ParamMap) => params.get("id"))
      .switchMap(idPage => this.http.get(`http://localhost/pages/${idPage}`))
      .map((page : Page) => page.contenu)
      .subscribe(texte => {
        this.pagehtml = this.servicePage.ParseWiki(texte);
        this.page = texte
      });
  }

  editer() {
    this.edition = !this.edition
  }
}
