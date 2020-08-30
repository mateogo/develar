/**
 *  Proceso para carga de archivos excel
 */

const whoami =  "models/zcargaEcel: ";
const mongoose = require('mongoose');

// necesarios para el proceso de importación
const config = require('../config/config')
const fs = require('fs');
const path = require('path');
const Excel = require('exceljs')

var workbook;
const self = this;

exports.getNRows = getNRows;
exports.getRegistros = getRegistros;

/* 	Devuelve número de filas */
function getNRows(req, errcb, cb){
    console.log("Importando archivo Excel para devolver número de filas...")
    const arch = path.join(config.rootPath, 'public/storage/assets/2020/08/30/personas.xlsx_1598816360524.xlsx');

    this.workbook = new Excel.Workbook();
    this.workbook.xlsx.readFile(arch)
        .then(
            function(value) {
                var worksheet = self.workbook.getWorksheet(1);
                cb({result: "ok",
                    nrows: worksheet.rowCount})
            },
            function(reason){
                console.log(reason);
            }
        )
}

function getRegistros(req, errcb, cb){
    console.log("Importando archivo Excel para devolver registros...")
    const arch = path.join(config.rootPath, 'public/storage/assets/2020/08/30/personas.xlsx_1598816360524.xlsx');

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
                        console.log("Row " + rowNumber + " = " + JSON.stringify(row.values));
                        var obj = {}
                        row.values.forEach((d,i)=>{
                            if(i!=0){
                                if(d.hasOwnProperty("result")){
                                    obj[colHeaders[i-1]] = d.result;
                                }else{
                                    obj[colHeaders[i-1]] = d;
                                }
                            }
                        })
                        registros.push(obj)
                    }
                })
                cb({result: "ok",
                    colHeaders: colHeaders,
                    registros: registros})
            },
            function(reason){
                console.log(reason);
            }
        )
}