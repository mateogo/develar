import { Component, OnInit, Input } from '@angular/core';
import { Person, personModel, BusinessMembersData } from '../../../../entities/person/person';

import { devutils }from '../../../../develar-commons/utils'

@Component({
  selector: 'empresa-members-view',
  templateUrl: './empresa-members-view.component.html',
  styleUrls: ['./empresa-members-view.component.scss']
})
export class EmpresaMembersViewComponent implements OnInit {

	@Input() token: BusinessMembersData;
	public pname;
	public pdoc;
  public edad = 0;
  public edadTxt = '';
  public ocupacion;
  public nacionalidad;
  public estado;
  public neducativo;
  public vinculoTxt;

  public hasImage = false;
  public imageUrl = '';
  public imageTitle = '';

  public isMaster = false;

  constructor() { }

  ngOnInit() {
    //c onsole.log('empresa-members-view token [%o]', this.token);

  	this.pname = personModel.getPersonDisplayName(this.token);
  	this.pdoc = personModel.getPersonDocum(this.token);
    if(this.token.fenac){
      this.edad = devutils.edadActual(new Date(this.token.fenac));
    }else{
      this.edad = 0
    }
    this.edadTxt = this.edad ? '(' + this.edad + ')' : '';

    this.vinculoTxt = personModel.getVinculoLaboral(this.token.vinculo);
    this.ocupacion = personModel.getProfesion(this.token.tocupacion)

    this.estado = personModel.getEstadoVinculo(this.token.estado);

    this.neducativo = personModel.getNivelEducativo(this.token.nestudios);

    if(this.token.assets && this.token.assets.length){
      this.token.assets.forEach(asset => {
        if(asset.entity === 'image' && asset.predicate === 'avatar'){
          this.hasImage = true;
          this.imageUrl = asset.entityId;
          this.imageTitle = asset.slug;
        }
      })
    }
    this.isMaster = this.token.isMaster;
  }

}
