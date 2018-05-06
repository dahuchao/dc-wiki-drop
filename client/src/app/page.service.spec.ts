import { TestBed, inject } from '@angular/core/testing';
import { Router, RouterOutlet } from "@angular/router";

import { PageService } from './page.service';

describe('PageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PageService]
    });
  });

  it('should be created', inject([PageService], (service: PageService) => {
    expect(service).toBeTruthy();
  }));

  it('doit rendre un texte simple', inject([PageService], (service: PageService) => {
    expect(service.ParseWiki("texte")).toBe("texte<br/>")
  }));

  it('doit rendre un titre h1', inject([PageService], (service: PageService) => {
    expect(service.ParseWiki("+titre")).toBe("<h1>titre</h1>")
  }));
});
