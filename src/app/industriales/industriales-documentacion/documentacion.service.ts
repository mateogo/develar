import { Injectable } from "@angular/core";
import { CardGraph } from '../../develar-commons/asset-helper';
import { DaoService } from '../../develar-commons/dao.service';


@Injectable({
    providedIn : 'root'
})
export class DocumentacionService {

    constructor(private _daoService : DaoService){}

    loadDefaultImg(type : string, cardGraph : CardGraph) : string {
        let imgName : string = '';
        //c onsole.log(type)
        switch(type){
            case 'application/pdf' : { imgName = 'logo-pdf.jpeg'; break;};
            case 'application/json': { imgName = 'logo-json.png'; break;};
            case 'application/vnd.ms-excel' : { imgName = 'logo-excel.png'; break;}
            case 'application/msword' : { imgName = 'logo-word.jpg'; break;};
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : { imgName = 'logo-word.jpg'; break;};
            case 'application/vnd.ms-powerpoint' : { imgName = 'logo-powerpoint.png'; break;};
            default : { imgName = 'logo-default.png'; break;};
        }


        return imgName;
    }

}