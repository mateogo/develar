import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

import { MapService } from './services/map.api';

import { SourceMapData, GeoMapBoxJSON, Geometry, GeoFeature, GeoJSON_Helper } from './map-model';

@Injectable()
export class MapaFacade {
    constructor(
        private _mapService: MapService,
    ) { }

    public initMap(mapContainer: string, centerLat: number, centerLon: number, initialZoom: number, dataToRender) {
        this._mapService.initMap(mapContainer, centerLat, centerLon, initialZoom, dataToRender)
    }

    public toggleLayer(layerId: string) {
        this._mapService.toggleLayer(layerId)
    }

    public getMapData(data: SourceMapData[]): Observable<GeoMapBoxJSON>{
        return (new BehaviorSubject<GeoMapBoxJSON>(GeoJSON_Helper.buildGeoJSONData(data))).asObservable()
    }

    // public getMockData(): Observable<GeoJSON>{
    //     return (new BehaviorSubject<GeoJSON>(GeoJSON_Helper.fetchMockData())).asObservable()
    // }

    public getDataGroups() {
        return this._mapService.getDataGroups()
    }

    public toggleGroup(groupId: string) {
        this._mapService.toggleGroup(groupId)
    }
}


