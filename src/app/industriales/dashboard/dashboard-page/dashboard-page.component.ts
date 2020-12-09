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

  private blacklistURLs = ['dashboard'];

  constructor(
    private router: Router,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const currentRoute = this.router.url;
        this.displayGoBackBtn = !this.blacklistURLs.includes(currentRoute);
      }
    });
  }

  public gotoIndustryBrowser(): void {
    this.location.back();
  }
}
