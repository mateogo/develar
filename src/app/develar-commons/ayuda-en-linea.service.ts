import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { RecordCard } from '../bookshelf/recordcard';
import { AyudaLineaModalComponent, DataAyudaLinea } from './ayuda-linea-modal/ayuda-linea-modal.component';

@Injectable({
    providedIn: 'root'
})
export class AyudaEnLineaService {

    private recordcardsUrl = 'api/recordcards';
    private searchUrl = 'api/recordcards/search';

    constructor(public dialog: MatDialog,
        private http: HttpClient) {

    }

    showOnlineHelp(codigo: string) {
        let dataModal = new DataAyudaLinea();
        dataModal.codigo = codigo;
        //Vamos a realizar la búsqueda por nuestro cardId
        this.loadRecordCards({ cardId: codigo }).then(cards => {
            if (cards && cards.length) {
                let recordCard = cards[0] as RecordCard;
                //Vamos a evaluar si tiene subfichas o no
                if (recordCard.relatedcards && recordCard.relatedcards.length) {
                    dataModal.recordCards = recordCard.relatedcards as RecordCard[];
                } else {
                    dataModal.recordCards = cards as RecordCard[];
                }
                this.dialog.open(AyudaLineaModalComponent, {
                    data: dataModal
                });


            }

        })


    }

    private buildParams(query) {
        return Object.getOwnPropertyNames(query)
            .reduce((p, key) => p.append(key, query[key]), new HttpParams());
    }

    private loadRecordCards<RecordCard>(query): Promise<RecordCard[]> {
        //let searchUrl = `${this.recordcardsUrl}/?slug=${query.term}&cardType=${query.type}&cardCategory=${query.category}`;
        let url = this.searchUrl;
        let params = this.buildParams(query);

        return this.http
            .get<RecordCard[]>(url, { params })
            .toPromise()
            .then(response => response)
            .catch(this.handleError);

    }

    private handleError(error: any): Promise<any> {
        console.error('Ocurrió un error recordcard service: [%s]', error);
        return Promise.reject(error.message || error);
    }
}