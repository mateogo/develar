import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit {
  public displayGoBackBtn = false;

  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.displayGoBackBtn = this.router.url.startsWith('/dashboard/industrias/editar');
      }
    });
  }

  public gotoIndustryBrowser(): void {
    this.router.navigate(['/dashboard/industrias']).then(url => {
      this.displayGoBackBtn = false;
    });
  }
}
