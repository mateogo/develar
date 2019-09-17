import { Component, OnInit } from '@angular/core';
import { gldef } from '../develar.config';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
	copyright = '© Copyright 2019 dvlr';
	version = '1.0';
  constructor() { }

  ngOnInit() {
		this.copyright = gldef.copyright || this.copyright;
		this.version = gldef.version || this.version;

  }
}
