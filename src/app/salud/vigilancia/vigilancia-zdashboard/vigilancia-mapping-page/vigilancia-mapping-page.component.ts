import { Component, OnInit } from '@angular/core';
import { SaludController } from '../../../salud.controller';
import { devutils }from '../../../../develar-commons/utils'

import { 	Asistencia,
 					Tile,
          AsistenciaTable,
          AsistenciaGeolocalizacion,
          AsistenciaBrowse,
          VigilanciaBrowse,
          DashboardBrowse,
					Alimento,
          AsistenciaSig, 
					UpdateAsistenciaEvent, 
					UpdateAlimentoEvent, 
					UpdateAsistenciaListEvent,
					AsistenciaHelper } from '../../../asistencia/asistencia.model';

import {SourceMapData, GeoMapBoxJSON, Geometry, GeoFeature, GeoJSON_Helper } from '../../../../develar-commons/mapbox/map-model';


@Component({
  selector: 'app-vigilancia-mapping-page',
  templateUrl: './vigilancia-mapping-page.component.html',
  styleUrls: ['./vigilancia-mapping-page.component.scss']
})
export class VigilanciaMappingPageComponent implements OnInit {
	public mapData: SourceMapData[] = [];
	public showMap = false;

  constructor(
  		private dsCtrl: SaludController
  	) { }

  ngOnInit(): void {
  	this.fetchData()

  }


  private fetchData(){
  	let query = new VigilanciaBrowse();
  	query.reporte = "GEOLOCALIZACION";
  	query = AsistenciaHelper.cleanQueryToken(query);
  	query.rebuildLatLon = true;
  	
  	this.dsCtrl.fetchGeoDashboard<AsistenciaGeolocalizacion>(query).subscribe(list => {
  		if(list && list.length){
  			this.mapData = list as SourceMapData[];
				this.showMap = true;
  		}
  	})
  }

}
