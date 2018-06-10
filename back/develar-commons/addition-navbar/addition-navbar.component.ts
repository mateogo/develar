import { Component, OnInit} from '@angular/core';

@Component({
  selector: 'addition-navbar',
  templateUrl: './addition-navbar.component.html',
  styleUrls: ['./addition-navbar.component.scss'],
  host: {
    '[class.addition-navbar]': 'true',
    '[class.open]': 'open'
  },
})
export class AdditionNavbarComponent implements OnInit {
  title: string;
  open: boolean;

  constructor() {
    this.title = 'Addition navbar';
    this.open = false;
  }

  openNavbar() {
    this.open = !this.open;
  }

  ngOnInit() { }
}
