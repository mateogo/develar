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

exports.importExcel = processExcel;

/* 	Importa archivo EXCEL */
function processExcel(req, errcb, cb){
    console.log("Importando archivo Excel...")
    // deploy
    //const arch = path.join(config.rootPath, '');

    // local
    const arch = path.join(config.rootPath, 'public/storage/assets/2020/08/28/test.xlsx_1598616254111.xlsx');
    
    var workbook = new Excel.Workbook();
    workbook.xlsx.readFile(arch)
        .then(function() {
            var worksheet = workbook.getWorksheet(1);
            worksheet.eachRow({includeEmpty : true}, function(row, rowNumber){
                //console.log("Row " + rowNumber + " = " + JSON.stringify(row.values));
            })
        })
    // return {
    //         nfilas: worksheet.rowCount,
    //         ncolumnas: worksheet.columnCount
    //     }
}
