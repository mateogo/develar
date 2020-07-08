import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import * as mapboxgl from 'mapbox-gl';
import * as mapConfig from '../config';
import { DynamicComponentService } from './dynamic-component.api';
import { MapPopupComponent } from '../components/map-popup/map-popup.component';

import { Observable, BehaviorSubject } from 'rxjs';


@Injectable()
export class MapService {
  mapbox;
  map: mapboxgl.Map;
  style = `mapbox://styles/mapbox/${mapConfig.STYLES.STREETS}`;

  private centerLat: number
  private centerLon: number
  private initialZoom: number

  private markerTypes: string[]
  private markerLists: any[]
  private data: any
  private dataToDisplay: any

  private hiddenGroups: string[]
  private hideAllMarkers: boolean

  constructor(
    private _dynamicComponentService: DynamicComponentService
  ) {
    this.markerLists = []
    this.markerTypes = []

    this.hiddenGroups = []
    this.hideAllMarkers = false
  }

  public getDataGroups(): string[] {
    return this.markerTypes
  }

  public initMap(mapContainer: string, centerLat: number, centerLon: number, initialZoom: number, data) {
    this.mapbox = (mapboxgl as typeof mapboxgl);
    this.mapbox.accessToken = environment.mapBoxToken;
    this.centerLat = centerLat
    this.centerLon = centerLon
    this.initialZoom = initialZoom
    this.data = Object.assign({}, data)
    this.dataToDisplay = Object.assign({}, data)

    this.map = new mapboxgl.Map({
      container: mapContainer,
      style: this.style,
      zoom: this.initialZoom,
      center: [this.centerLon, this.centerLat]
    });

    this.setupMap()
  }

  private setupMap(): void {
    this.map.addControl(new mapboxgl.NavigationControl())
    this.addDataSource('mab-covid19', 'geojson', this.dataToDisplay)

    if (this.dataToDisplay.features.length > 0) {
      // Voy a construir marcadores, por lo tanto solo me sirven puntos geometricos
      let pointFeatures = this.dataToDisplay.features.filter(x => x.geometry.type === 'Point')

      pointFeatures.forEach((item) => {
        let theMarker = this.addMarker(item)

        if (this.markerLists[item.properties.tipo] === undefined) {
          this.markerLists[item.properties.tipo] = []
        }

        this.markerLists[item.properties.tipo].push(theMarker)
      })

      this.markerTypes = Object.keys(this.markerLists)
    }

    // TODO: Abstracción de addLayer donde el tipo de capa esté parametrizado
    this.addHeatmapLayer()
  }

  public addDataSource(sourceId: string, sourceType: string, sourceData): void {
    this.map.on('load', function () {
      this.addSource(sourceId, {
        type: sourceType,
        data: sourceData
      })
    })
  }

  public toggleLayer(layerId: string) {
    switch (layerId) {
      case 'heatmap':
        const status = this.map.getLayoutProperty('mab-covid19-heatmap', 'visibility')
        if (status === 'visible') {
          this.map.setLayoutProperty('mab-covid19-heatmap', 'visibility', 'none')
        } else {
          this.map.setLayoutProperty('mab-covid19-heatmap', 'visibility', 'visible')
        }
        break;
      case 'markers':
        this.hideAllMarkers = !this.hideAllMarkers

        this.markerTypes.filter(item => !this.hiddenGroups.includes(item)).forEach((item) => {
          this.markerLists[item].forEach((innerItem) => {
            let visibilityStatus = innerItem.getElement().style.visibility || 'visible'
            let newVisibilityStatus = 'visible'

            if (visibilityStatus === 'visible') {
              newVisibilityStatus = 'hidden'
            }

            innerItem.getElement().style.visibility = newVisibilityStatus;
          })
        })
        break;
      default: break;
    }
  }

  public toggleGroup(groupId: string): void {
    // Si en el datasource está el grupo que se pretende ocultar...
    if (this.hasDataGroup(groupId)) {
      this.dataToDisplay.features = this.dataToDisplay.features.filter(feature => groupId !== feature.properties.tipo)
      this.hiddenGroups.push(groupId)
    } else {
      this.hiddenGroups = this.hiddenGroups.filter(item => item !== groupId)

      this.dataToDisplay.features = this.dataToDisplay.features.concat(
        this.data.features.filter(item => item.properties.tipo === groupId)
      )
    }

    // TODO: Nombre del DataSource configurable
    this.map.getSource('mab-covid19'); //.setData(this.dataToDisplay)

    // Apagamos o encendemos los marcadores
    if (!this.hideAllMarkers) {
      this.markerLists[groupId].forEach((item) => {
        let visibilityStatus = item.getElement().style.visibility || 'visible'

        let newVisibilityStatus = 'visible'

        if (visibilityStatus === 'visible') {
          newVisibilityStatus = 'hidden'
        }

        item.getElement().style.visibility = newVisibilityStatus;
      })
    }
  }

  private hasDataGroup(groupId: string): boolean {
    let flag = false;
    flag = this.dataToDisplay.features.find(feature => feature.properties.tipo === groupId) !== undefined
    return flag;
  }

  private addMarker(item: any): mapboxgl.Marker {
    let markerColor = mapConfig.MARKER_COLORS.find(colorItem => colorItem.tipo === item.properties.tipo).color

    let theMarker = new mapboxgl.Marker({ color: markerColor }).setLngLat(
      new mapboxgl.LngLat(item.geometry.coordinates[0], item.geometry.coordinates[1])
    )

    theMarker.setPopup(new mapboxgl.Popup()
      .setDOMContent(this._dynamicComponentService.injectComponent(
        MapPopupComponent, compData => compData.data = item.properties)
      ))
      .addTo(this.map)

    return theMarker;
  }

  private addHeatmapLayer(): void {
    // TODO: 'id', 'tipo', 'source', 'maxzoom' parametrizables
    this.map.on('load', function () {
      this.addLayer(
        {
          'id': 'mab-covid19-heatmap',
          'type': 'heatmap',
          'source': 'mab-covid19',
          'maxzoom': 16,
          'layout': {
            'visibility': 'visible'
          },
          'paint': mapConfig.HEATMAP_PAINT
        }
      )
    })
  }
}
