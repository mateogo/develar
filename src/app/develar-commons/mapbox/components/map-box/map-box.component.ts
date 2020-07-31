import { Component, OnInit, Input } from '@angular/core';
import { MapaFacade } from '../../mapa.facade';
import { Observable } from 'rxjs';

import { SourceMapData,    GeoMapBoxJSON, Geometry, GeoFeature, GeoJSON_Helper } from '../../map-model';

@Component({
  selector: 'app-map-box',
  templateUrl: './map-box.component.html',
  styleUrls: ['./map-box.component.scss']
})
export class MapBoxComponent implements OnInit {
  // Recibe los datos a dibujar en el mapa

  // Cuando se integre con develar, comentar 'public data' y descomentar esto
  @Input() mapData: SourceMapData[] = [];
  @Input() public initialZoom: number = 12
  @Input() public centerLat: number   = -34.800183
  @Input() public centerLon: number   = -58.3895733

  //private mockData = GeoJSON_Helper.fetchMockData()
  public  data: GeoMapBoxJSON

  public mapLayers
  public selectedLayers: string[]

  public mapFilters
  public selectedFilters: string[]
  public showMap = false;

  constructor(
    private _mapaFacade: MapaFacade
  ) {
    this.mapLayers = [
      { key: 'markers', label: 'Marcadores' },
      { key: 'heatmap', label: 'Mapa de calor' }
    ]

    this.selectedLayers = ['markers', 'heatmap'];

  }

  ngOnInit() {
    // De momento los datos se obtienen del service como un Observable. 
    // Luego debieran pasarse como parámetro de entrada desde el contenedor
    // del mapa
    setTimeout(()=>{
      this._mapaFacade.getMapData(this.mapData).subscribe(geoJSON => {
        this.data = geoJSON;
        this._mapaFacade.initMap('mapa', this.centerLat, this.centerLon, this.initialZoom, this.data);
        this.mapFilters = this.selectedFilters = this._mapaFacade.getDataGroups()
      })
      this.showMap = true;

    },200)
  }

  onLayerSelectionChange($event): void {
    const buttonPressed = $event.value
    this._mapaFacade.toggleLayer(buttonPressed)
  }

  onFilterSelectionChange($event): void {
    const filterPressed = $event.value
    this._mapaFacade.toggleGroup(filterPressed)
  }
}