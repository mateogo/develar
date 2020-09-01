/**
 *  Proceso para carga de archivos excel
 */

const whoami =  "models/zcargaExcel: ";

// necesarios para el proceso de importación
const config = require('../config/config')
const path = require('path');
const Excel = require('exceljs')

const moment = require('moment'); 

var workbook;
const self = this;

exports.getData = getData;

function getData(req, errcb, cb){
    console.log("Importando archivo Excel para devolver registros...")
    const arch = path.join(config.rootPath, 'public/'+req.body.path);
	//const arch = path.join(config.rootPath, 'public/personas.xlsx');

    this.workbook = new Excel.Workbook();
    this.workbook.xlsx.readFile(arch)
        .then(
            function(value) {
                var worksheet = self.workbook.getWorksheet(1);
                var colHeaders = [];
                var registros = [];

                for (const x of Array(worksheet.columnCount).keys()){
                    colHeaders.push(worksheet.getRow(1).values[x+1]);
                }
                
                worksheet.eachRow({includeEmpty : false}, function(row, rowNumber){
                    if (rowNumber>1){
                        //console.log("Row " + rowNumber + " = " + JSON.stringify(row.values));
                        var obj = {}
                        row.values.forEach((d,i)=>{
                            if(i!=0){
                                if(d.hasOwnProperty("result")){
                                    d = d.result;
                                }
                                if(typeof d.getMonth === 'function'){
                                    d = moment(d).format("DD/MM/YYYY");
                                }
                                obj[colHeaders[i-1]] = d+"";
                            }
                        })
                        registros.push(obj)
                    }
                })
                cb({result: "ok",
                    nrows: registros.length,
                    colHeaders: colHeaders,
                    registros: registros})
            },
            function(reason){
                console.log(reason);
            }
        )
}