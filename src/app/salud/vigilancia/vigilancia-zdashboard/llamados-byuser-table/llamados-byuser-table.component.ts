import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'llamados-byuser-table',
  templateUrl: './llamados-byuser-table.component.html',
  styleUrls: ['./llamados-byuser-table.component.scss']
})
export class LlamadosByuserTableComponent implements OnInit {
  @Input() usertable: Array<UserFollowUp> = []
  public showTable = false;

  constructor() { }

  ngOnInit(): void {
    this.showTable = true;
  }

}

class UserFollowUp {
  username: string = '';
  userId: string = '';
  qty = 0;
  qcovid = 0;
  qnocovid = 0;
  qlogrado = 0;
  qnocontesta = 0;
  qnotelefono = 0;
  qty_dow = [0, 0, 0, 0, 0, 0, 0];
  constructor(uid, uname){
    this.userId = uid;
    this.username = uname;
  }
}
