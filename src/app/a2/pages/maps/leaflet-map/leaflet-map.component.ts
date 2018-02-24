import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../../develar-commons/shared-service';
import * as L from 'leaflet';

@Component({
  selector: 'page-leaflet-map',
  templateUrl: './leaflet-map.component.html',
  styleUrls: ['./leaflet-map.component.scss']
})
export class PageLeafletMapComponent implements OnInit {
  pageTitle: string = 'Leaflet Map';
  lat: number = 50.4664212;
  lng: number = 30.6;

  constructor( private _sharedService: SharedService ) {
    this._sharedService.emitChange(this.pageTitle);
  }

  ngOnInit(){
    let mymap: any = L.map('map').setView([this.lat, this.lng], 13);
    let circle:any = L.circle([this.lat, this.lng], {
      color: '#dc143c',
      fillColor: '#dc143c',
      fillOpacity: 0.2,
      radius: 800
    }).addTo(mymap);

    L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibmV4dC1pdGVtIiwiYSI6ImNqMDFlYWRqeTAyNzEyd3FuNjQxdmVvMjgifQ.Ff8pEWrzeJ3uipr78e69uw', {
      maxZoom: 18,
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
      '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="http://mapbox.com">Mapbox</a>',
      id: 'mapbox.streets'
    }).addTo(mymap);
  }
}
