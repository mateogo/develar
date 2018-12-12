import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../../develar-commons/shared-service';
import { latLng, tileLayer, circle, polygon, marker } from 'leaflet';

@Component({
  selector: 'page-leaflet-map',
  templateUrl: './leaflet-map.component.html',
  styleUrls: ['./leaflet-map.component.scss']
})
export class PageLeafletMapComponent implements OnInit {
  pageTitle: string = 'Leaflet Map';
  options: any;
  layersControl: any;
  layers: any[];

  constructor( private _sharedService: SharedService ) {
    this._sharedService.emitChange(this.pageTitle);
  }

  ngOnInit(){
    this.options = {
      layers: [
        tileLayer(
          'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          { maxZoom: 18, attribution: '...' }
        )
      ],
      zoom: 5,
      center: latLng(46.879966, -121.726909)
    };
    this.layersControl = {
      baseLayers: {
        'Open Street Map': tileLayer(
          'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          { maxZoom: 18, attribution: '...' }
        ),
        'Open Cycle Map': tileLayer(
          'http://{s}.tile.opencyclemap.org/{z}/{x}/{y}.png',
          { maxZoom: 18, attribution: '...'
          })
      },
      overlays: {
        'Big Circle': circle([ 46.95, -122 ], { radius: 5000 }),
        'Big Square': polygon([[ 46.8, -121.55 ], [ 46.9, -121.55 ], [ 46.9, -121.7 ], [ 46.8, -121.7 ]])
      }
    };
    this.layers = [
      circle([ 46.95, -122 ], { radius: 5000 }),
      polygon([[ 46.8, -121.85 ], [ 46.92, -121.92 ], [ 46.87, -121.8 ]]),
      marker([ 46.879966, -121.726909 ])
    ];
  }

  onMapReady(map) {
    setTimeout(() => {
      map.invalidateSize();
    }, 0);
  }
}
