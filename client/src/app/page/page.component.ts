import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Page} from './page';

@Component({selector: 'app-page', templateUrl: './page.component.html', styleUrls: ['./page.component.css']})
export class PageComponent implements OnInit {
  edition : boolean = true
  page : string = `Il ne faut pas *vendre* la _peau_ de l 'ourse =avant= 
d' avoir crier victoire 
trop tot !!Tel est pris qui rira * bien * le _dernier_
 ! C 'est la cerise sur le pompom ! C'est l'étincelle qui 
fait déborder le vase ! C'est la goutte d'eau qui met le feu
aux poudres ! Petit à petit l'oiseau devient forgeron ! Les 
ciseaux à bois : Les [chiens] aussi.
`
  constructor(private http : HttpClient) {}

  ngOnInit() {
    this
      .http
      .get("http://localhost/pages/test.txt")
      .subscribe((page : Page) => {
        console.log(`data: ${JSON.stringify(page)}`)
        this.page = page.contenu;
      })
  }

  editer() {
    this.edition = !this.edition
  }
}
