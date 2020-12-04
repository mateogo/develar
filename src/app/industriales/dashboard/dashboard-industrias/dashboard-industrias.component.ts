import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PersonService } from '../../../entities/person/person.service';
import { UserService } from '../../../entities/user/user.service';
import { UserWebService } from '../../../entities/user-web/user-web.service';
import { DaoService } from '../../../develar-commons/dao.service';
import { Person } from '../../../entities/person/person';

@Component({
  selector: 'app-dashboard-industrias',
  templateUrl: './dashboard-industrias.component.html',
  styleUrls: ['./dashboard-industrias.component.scss']
})
export class DashboardIndustriasComponent implements OnInit {
  public industriasDashboardTitle = 'Industrias';
  public industriasDashboardSubtitle = 'Mis industrias asociadas';

  public industriasList = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private personService: PersonService,
    private daoService: DaoService,
    private userService: UserService,
    private userWebService: UserWebService
  ) { }

  ngOnInit(): void {
    this.initIndustriaDashboard();
  }

  private initIndustriaDashboard(): void {
    this.userWebService.fetchPersonByUserId(this.userService.currentUser._id).then(person => {
      if (person) {
        this.daoService.search('person', { integrantes: person[0]._id }).subscribe(items => {
          if (items && items.length > 0) {
            this.industriasList = items;
          } else {
            this.industriasList = [];
          }
        });
      }
    });
  }

  public gotoIndustriasPage(): void {
    this.router.navigate(['industrias'], { relativeTo: this.route });
  }
}
