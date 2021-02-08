import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit {
  public displayGoBackBtn = false;
  public titulo = "CENSO EMPRESARIAL 2021 - ALMIRANTE BROWN"

  // URLs donde el responsable de mostrar el botón "Volver" es
  // dashboard-page y no el componente propiamente dicho
  private whitelistURLs = [
    '/dashboard/censos/censo2020',
    '/dashboard/censos/censo2021',
    '/dashboard/personas',
    '/dashboard/industrias/editar'
  ];

  constructor(
    private router: Router,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const currentRoute = event.url;

        for (let k = 0; k < this.whitelistURLs.length; k++) {
          this.displayGoBackBtn = false;
          if (currentRoute.startsWith(this.whitelistURLs[k])) {
            this.displayGoBackBtn = true;
            break;
          }
        }
      }
    });
  }

  public goBack(): void {
    this.location.back();
  }
}
