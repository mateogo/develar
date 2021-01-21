/**
 * Generación de ouputs en formato PDF
 * Otra librería de posible utilización 'html-pdf'
 * no considerada en este momento por estar discontinuada.
 */
const fs = require('fs')
const PDFDocument = require('pdfkit');
const path = require('path');
const config = require('../config/config');
const utils = require('../services/commons.utils');
const person = require('../models/personModel.js');

const rootPath = config.rootPath;
const basePath =  path.join(rootPath, '/core');
//const savePath =  path.join(rootPath, '/public/storage/assets');
const savePath =  path.join(rootPath, '/www/salud/storage/assets');
const asisprevencion = require('../models/asisprevencionModel.js');
const asisModel = asisprevencion.getRecord();
const personModel = person.getRecord();
//API

exports.genAltaEpidemioForm = genAltaEpidemioForm;


// pageSize: A4
const spec = {
    page:       'A4',
    margin_left: 36,
    margin_default: 15,
    bg_col:      '#3344ff',
    font_size:   9,
    actualWidth: 596,
}
// Colors
const BLACK = 'black';
const GRIS_1 = '#aaaaaa';
const GRIS_2 = '#afafaf';

const ROBOTO_REGULAR = path.join(basePath,'/fonts/Roboto-Regular.ttf');
const ROBOTO_BOLD = path.join(basePath,'/fonts/Roboto-Bold.ttf');

const LOGO = path.join(basePath,'/img/logo-MAB-azul.png');
const FIRMA = path.join(basePath,'/img/firmaCertificadoAltaCovid.png');

const DEFINICION_CASO = 'https://www.argentina.gob.ar/salud/coronavirus-COVID-19/definicion-de-caso'

const vinculosOptList = [
        {val: 'no_definido',       label: 'Seleccione opción',slug:'Seleccione opción' },
        {val: 'pareja',   label: 'Pareja',    slug:'Pareja' },
        {val: 'esposx',   label: 'Esposo/a',  slug:'Esposo/a' },
        {val: 'hijx',     label: 'Hijo/a',    slug:'Hijo/a' },
        {val: 'padre',    label: 'Padre',     slug:'Padre' },
        {val: 'madre',    label: 'Madre',     slug:'Madre' },
        {val: 'contactx', label: 'Contacto c/riesgo contagio',  slug:'Otro c/riesgo contagio' },
        {val: 'tix',      label: 'Tío/a',     slug:'Tío/a' },
        {val: 'hermanx',  label: 'Hermana/o', slug:'Hermana/o' },
        {val: 'abuelx',   label: 'Abuela/o',  slug:'Abuela/o' },
        {val: 'nietx',    label: 'Nieto/a',   slug:'Nieto/a' },
        {val: 'sobrinx',  label: 'Sobrino/a', slug:'Sobrino/a' },
        {val: 'pariente', label: 'Pariente',  slug:'Pariente' },
        {val: 'vecinx',   label: 'Vecino/a',  slug:'Vecino/a' },
        {val: 'otro',     label: 'Otro',      slug:'Otro' },
];

const locMuestraOptList = [
    { val: 'emergen107', label: 'Emergencia/107' },
    { val: 'detectar',   label: 'Operativo DeTecTar' },
    { val: 'CAPS01',     label: 'CAPS-01 Min Rivadavia' },
    { val: 'CAPS06',     label: 'CAPS-06 Los álamos' },
    { val: 'CAPS12',     label: 'CAPS-12 Don Orione' },
    { val: 'CAPS15',     label: 'CAPS-15 Glew 2' },
    { val: 'CAPS16',     label: 'CAPS-16 Rafael Calzada' },
    { val: 'CAPS26',     label: 'CAPS-26 USAmb Burzaco' },
    { val: 'otro',       label: 'Otro/ extra-Muni'  },
];

const ciudadesBrown = [
    {val: 'no_definido',         cp:'1800', label: 'Seleccione opción',slug:'Seleccione opción' },
    {val: 'adrogue',             cp:'1846', label: 'Adrogué ',   slug:'Adrogué' },
    {val: 'burzaco',             cp:'1852', label: 'Burzaco ',   slug:'Burzaco' },
    {val: 'calzada',             cp:'1847', label: 'Rafael Calzada ',   slug:'Rafael Calzada' },
    {val: 'claypole',            cp:'1849', label: 'Claypole',   slug:'Claypole' },
    {val: 'donorione',           cp:'1850', label: 'Don Orione', slug:'Don Orione' },
    {val: 'glew',                cp:'1856', label: 'Glew',       slug:'Glew' },
    {val: 'longchamps',          cp:'1854', label: 'Longchamps', slug:'Longchamps' },
    {val: 'malvinasargentinas',  cp:'1846', label: 'Malvinas Argentinas',slug:'Malvinas Argentinas' },
    {val: 'marmol',              cp:'1845', label: 'J.Mármol',   slug:'J.Mármol' },
    {val: 'ministrorivadavia',   cp:'1852', label: 'Ministro Rivadavia',slug:'Ministro Rivadavia' },
    {val: 'solano',              cp:'1846', label: 'San Fco Solano',   slug:'San Fco Solano' },
    {val: 'sanjose',             cp:'1846', label: 'San José',   slug:'San José' },
    {val: 'extradistrito',       cp:'0000', label: 'Extra distrito',   slug:'Fuera del Municipio de Brown' },
];


function genAltaEpidemioForm(req, res){
    let asisId = req.params.id;
    if(asisId){
        console.log('CERTIFICADO DE ALTA EPIDEMIO [%s]', asisId);
 
        let asisPromise = asisModel.findById(asisId).exec()
        asisPromise.then(asis => {
            if(asis){

                if(asis.idPerson){
                    let personPromise = personModel.findById(asis.idPerson).exec();
                    personPromise.then(person => {
                        if(person){
                            const data = mapQueryToHisopadoData(asis, person)
                            buildConstanciaAlta(data, req, res); 

                        }else{
                            //error: Persona no encontrada
                        }
                    })

                }else {
                    //error: asistencia sin Id de Persona
                }
            }else {
                //error: asistencia no recuperada
            }
        })

    }else{
        const data = getMockData()
        buildConstanciaAlta(data, req, res); 

    }


}



function buildConstanciaAlta(data, req, res){ 
    /***********************/
    /***   PDF BEGINS    **/
    /*********************/
    const { page, margin_default, margin_left } = spec;
    const today = new Date();
    const doc = new PDFDocument({
        size: page,
        margins: {
            top:    margin_default,
            left:   margin_left,
            right:  margin_default,
            bottom: margin_default
        }
    });

    doc.pipe(fs.createWriteStream(data.outputFile));
    doc.pipe(res);

    sectionHeader(doc, 1, spec)
    // LOGO

    sectionTitle(doc, 110,'CERTIFICADO DE CUMPLIMIENTO DE AISLAMIENTO', spec)
    seccionUno(doc, data, today, 138, spec)
 
    // sectionTitle(doc, 125,'IDENTIFICACIÓN DEL CASO - EVENTO EN EL SNVS', spec)
    seccionDOS(doc, 205, data, spec)

    seccionTRES(doc, 395, data, spec)


    // sectionTitle(doc, 220,'INFORMACIÓN CLÍNICA', spec)
    // seccionTRES(doc, 240, data, spec)

    // sectionTitle(doc, 270,'SIGNOS Y SÍNTOMAS', spec)
    // seccionCUATRO(doc, 290, data, spec)

    // sectionTitle(doc, 320,'ENFERMEDADES PREVIAS / COMORBILIDADES', spec)
    // seccionCINCO(doc, 340, data, spec)

    // sectionTitle(doc, 405,'INVESTIGACIÓN EPIDEMIOLÓGICA', spec)
    // seccionSEIS(doc, 425, data, spec)

    // sectionTitle(doc, 510,'CONVIVIENTES ó CONTACTOS ESTRECHOS', spec)
    // seccionSIETE(doc, 530, data, spec)

    // sectionTitle(doc, 662,'LABORATORIO', spec)
    // seccionOCHO(doc, 686, data, spec)

    seccionCIERRE(doc, 790, data, spec)

    doc.end();

}
/**************************************/
/***** SECTION FUNCTIONS            **/
/************************************/


function sectionHeader(doc, y, spec){
    const { bg_col } = spec;

    let text01 = "Epidemia COVID-19 - Ley Nacional 27.541/2020 - DNU 250/2020 297/2020"
    let text02 = "***** NO CONSTITUYE PERMISO DE CIRCULACIÓN *****"
    let text03 = "AISLAMIENTO PREVENTIVO PREVENTIVO OBLIGATORIO"
    let text04 = 'SECRETARÍA de SALUD - MUNICIPALIDAD DE ALMIRANTE BROWN';

    doc.rect(0, 0, 596, 72).fill('#ffffff').stroke();
    doc.image(LOGO, 25, 15, {
      fit: [150, 150],
      align:  'left',
      valign: 'top'
    });

    doc.font(ROBOTO_REGULAR)
       .fillColor(bg_col)
       .fontSize(9)
       .text(text01, 260, 25)
       .font(ROBOTO_BOLD)
       .fontSize(11)
       .text(text03)
       .font(ROBOTO_REGULAR)
       .fontSize(8)
       .text(text04);
       
    doc.font(ROBOTO_BOLD)
       .fillColor(bg_col)
       .fontSize(11)
       .text(text02, 170, 80)

}

function seccionUno(doc, data, today, y, spec){
    const { margin_left, font_size } = spec;
    let offset = 15;
    let h1_offset = 10;
    let h2_offset = 120;
    let right = 330;
    let right_offset = 80;

    let th11 = 'Fecha de emisión: ';
    let th13 = 'Certificado Nro: ';
    let th21 = 'SOLICITANTE: ';
    let th22 = 'DNI SOLICITANTE: ' ;
    let th23 = 'DOMICILIO DECLARADO: ';

    let tx11 = data.fechaemision;
    let tx13 = data.compNum + '/' + today.getYear() + '/COVID-19';
    let tx21 = data.displayAs;
    let tx22 = data.ndoc;
    let tx23 = data.locacion1;
    let tx24 = data.locacion2;

    doc.fillColor(BLACK)
        .fontSize(font_size);

    doc.font(ROBOTO_BOLD)
        .fontSize(font_size)
        .text(th11, margin_left + right,  y + offset * 0);
    doc.font(ROBOTO_REGULAR)
        .fontSize(font_size)
        .text(tx11, margin_left + right + right_offset,  y + offset * 0);

    doc.font(ROBOTO_BOLD)
        .fontSize(font_size)
        .text(th13, margin_left + right,  y + offset * 1);
    doc.font(ROBOTO_REGULAR)
        .fontSize(font_size)
        .text(tx13, margin_left + right + right_offset,  y + offset * 1);

    doc.font(ROBOTO_BOLD)
        .fontSize(font_size)
        .text(th21, margin_left + h1_offset,  y + offset * 0);
    doc.font(ROBOTO_REGULAR)
        .fontSize(font_size)
        .text(tx21, margin_left + h2_offset,  y + offset * 0);


    doc.font(ROBOTO_BOLD)
        .fontSize(font_size)
        .text(th22, margin_left + h1_offset,  y + offset * 1);
    doc.font(ROBOTO_REGULAR)
        .fontSize(font_size)
        .text(tx22, margin_left + h2_offset,  y + offset * 1);

    doc.font(ROBOTO_BOLD)
        .fontSize(font_size)
        .text(th23, margin_left + h1_offset,  y + offset * 2);
    doc.font(ROBOTO_REGULAR)
        .fontSize(font_size)
        .text(tx23, margin_left + h2_offset,  y + offset * 2);
    doc.font(ROBOTO_REGULAR)
        .fontSize(font_size)
        .text(tx24, margin_left + h2_offset,  y + offset * 2 + 11);




}

function seccionDOS(doc, y, data, spec){
    const { margin_left, font_size } = spec;
    let offset = 15;
    let h1_offset = 10

    let th01 = 'ÁMBITO Y REGLAMENTACIONES APLICADAS'
    let tX01 = `El presente documento se emite en el marco de la verificación del aislamiento preventivo obligatorio del operativo COVID-19, en cumplimiento de funciones específicas estipuladas en la Ley Nacional 27.541, D.N.U. Nro 260/2020 y 297/2020 del P.E.N., publicado en el Boletín Oficial el día 12 de marzo de 2020, en su edición 34.327, complementado por el Decreto Provincial 132/2020, y Decreto Municipal 327/2020, que conforme los considerandos que determinan: "... que, en la situación actual, resulta necesario la adopción de nuevas medidas oportunas, transparentes, consensuadas y basadas en evidencia científica, que se sumen a las ya adoptadas desde el inicio de esta situación epidemiológica, a fin de mitigar su propagación y su impacto sanitario...", y específicamente se establece en su ARTÍCULO 7o.- AISLAMIENTO PREVENTIVO OBLIGATORIO. ACCIONES PREVENTIVAS:"... 1. Deberán permanecer aisladas durante 14 días, plazo que podrá ser modificado por la autoridad de aplicación según la evolución epidemiológica, las siguientes personas: a) Quienes revistan la condición de "casos sospechosos". A los fines del presente Decreto, se considera "caso sospechoso" a la persona que presenta fiebre y uno o más síntomas respiratorios (tos, dolor de garganta o dificultad respiratoria) y que además, en los últimos días, tenga historial de viaje a "zonas afectadas" o haya estado en contacto con casos confirmados o probables de COVID-19.
    Salvo las excepciones establecidas en los decretos 260/2020, 294/2020, 297/2020 y 331/2020, la presente NO CONSTITUYE UN SALVOCONDUCTO O PERMISO DE CIRCULACIÓN en el ámbito del territorio nacional, debiendo el portador de la presente gestionar el trámite correspondiente ante la autoridad competente por el servicio digital creada a tales efectos.
    `


    doc.fillColor(BLACK)
        .fontSize(font_size);
    
    doc.font(ROBOTO_BOLD)
        .fontSize(font_size)
        .text(th01, margin_left + h1_offset,  y + offset * 0);

    doc.font(ROBOTO_REGULAR)
        .fontSize(font_size)
        .text(tX01, margin_left + h1_offset,  y + offset * 1);

 }

 function seccionTRES(doc, y, data, spec){
    const { margin_left, font_size } = spec;
    let offset = 15;
    let h1_offset = 10

    let th01 = 'EL ABAJO FIRMANTE CERTIFICA'
    let tX01 = ` que el día ${ data.fechaemision } se constituye en el DOMICILIO DECLARADO, verificando el cumplimiento del AISLAMIENTO PREVENTIVO OBLIGATORIO por parte del SOLICITANTE, que acredita identidad con su Documento Nacional de Identidad, el cual fuera indicado por la autoridad sanitaria a partir del día ${ data.fe_inicio }.`
    let tx02 = `Se extiende el presente certificado a los efectos de ser presentado ante la autoridad que corresponda y/o empleador de quien dependa.`
    let tx03 = `En la ciudad de ADROGUÉ, partido de Almirante Brown, a los ${ data.fechaemision }, se emite el presente certificado a través de los sistemas informáticos del Municipio, con la validación del funcionario actuante.`

    doc.fillColor(BLACK)
        .fontSize(font_size);
    
    doc.font(ROBOTO_BOLD)
        .fontSize(font_size)
        .text(th01, margin_left + h1_offset,  y + offset * 0, {continued: true})
        .font(ROBOTO_REGULAR)
        .text(tX01);
    
    doc.font(ROBOTO_BOLD)
        .fontSize(font_size)
        .text(tx02, margin_left + h1_offset,  y + offset * 3)
 
    doc.font(ROBOTO_BOLD)
        .fontSize(font_size)
        .text(tx03, margin_left + h1_offset,  y + offset * 5)
 
    doc.image(FIRMA, 350, 500, {
            fit: [150, 150],
            align:  'left',
            valign: 'top'
          });
      

 }


function seccionCUATRO(doc, y, data, spec){
    const { margin_left, font_size } = spec;
    let offset = 15;

    let tx01 = `Tiene fiebre: ${data.tienefiebre}`;
    let tx02 = `Fiebre 37.5C ó más: ${data.fiebre}`;
    let tx03 = `Anosmia reciente: ${data.anosmia}`;
    let tx04 = `Disgeusia reciente: ${data.disgeusia}`;

    let tx05 = `Tos: ${data.tos}`;
    let tx06 = `Disnea (Dif p/respirar): ${data.disnea}`;
    let tx07 = `Odinofagia (Dolor garganta): ${data.odinofagia}`;
    let tx08 = `Otros síntomas: ${data.otrosSintomas}`;

    doc.fillColor(BLACK)
        .fontSize(font_size);

    doc.text(tx01, margin_left + 1,    y + 0 * offset);
    doc.text(tx02, margin_left + 80,   y + 0 * offset);
    doc.text(tx03, margin_left + 200,  y + 0 * offset);
    doc.text(tx04, margin_left + 350,  y + 0 * offset);

    doc.text(tx05, margin_left + 1,    y + 1 * offset);
    doc.text(tx06, margin_left + 80,   y + 1 * offset);
    doc.text(tx07, margin_left + 200,  y + 1 * offset);
    doc.text(tx08, margin_left + 350,  y + 1 * offset);
}

function seccionCINCO(doc, y, data, spec){
    const { margin_left, font_size } = spec;
    let offset = 15;

    let tx11 = `${data.comorbilidad}`;
    let tx21 = `Enf crónica: ${data.cronica}`;
    let tx31 = `Otros: ${data.otrasComorbilidades}`;

    let tx12 = `Enferm hepática: ${data.hepatica}`;
    let tx22 = `Enferm neurológica: ${data.neurologica}`;
    let tx32 = `Enferm oncológica: ${data.oncologica}`;
    let tx42 = `Enferm renal crónica: ${data.renal}`;

    let tx13 = `EPOC:  ${data.epoc}`;
    let tx23 = `Fumador: ${data.fumador}`;
    let tx33 = `Hipert arterial: ${data.hta}`;
    let tx43 = `Tuberculosis:  ${data.tuberculosis}`;

    let tx14 = `Insuficiencia cardíaca: ${data.insufcardiaca}`;
    let tx24 = `Diag previo neumonía: ${data.neumonia}`;
    let tx34 = `Inmunosupr congé/adq:  ${data.inmunosupresion}`;
    let tx44 = `Puerperio: ${data.puerperio}`;

    let tx15 = `Asma:  ${data.asma}`;
    let tx25 = `Diabetes: ${data.diabetes}`;
    let tx35 = `Diálisis aguda: ${data.dialisisAguda}`;
    let tx45 = `Obesidad: ${data.obesidad}`;


    doc.fillColor(BLACK)
        .fontSize(font_size);
    doc.text(tx11, margin_left + 1,    y + 0 * offset);
    doc.text(tx21, margin_left + 1,    y + 1 * offset);
    doc.text(tx31, margin_left + 1,    y + 2 * offset);

    doc.text(tx12, margin_left + 142,   y + 0 * offset);
    doc.text(tx22, margin_left + 142,   y + 1 * offset);
    doc.text(tx32, margin_left + 142,   y + 2 * offset);
    doc.text(tx42, margin_left + 142,   y + 3 * offset);

    doc.text(tx13, margin_left + 247,   y + 0 * offset);
    doc.text(tx23, margin_left + 247,   y + 1 * offset);
    doc.text(tx33, margin_left + 247,   y + 2 * offset);
    doc.text(tx43, margin_left + 247,   y + 3 * offset);


    doc.text(tx14, margin_left + 333,   y + 0 * offset);
    doc.text(tx24, margin_left + 333,   y + 1 * offset);
    doc.text(tx34, margin_left + 333,   y + 2 * offset);
    doc.text(tx44, margin_left + 333,   y + 3 * offset);

    doc.text(tx15, margin_left + 465,   y + 0 * offset);
    doc.text(tx25, margin_left + 465,   y + 1 * offset);
    doc.text(tx35, margin_left + 465,   y + 2 * offset);
    doc.text(tx45, margin_left + 465,   y + 3 * offset);


}

function seccionSEIS(doc, y, data, spec){
    const { margin_left, font_size } = spec;
    let offset = 15;
    let font_title = 12;

    let tx11 = `Trabaja actualmente: ${data.trabaja}`;
    let tx12 = `¿De qué trabaja?: ${data.trabajoTxt}`;

    let tx21 = `FACTORES DE RIESGO (Exposición a COVID-19 en los últimos 14 días):`;
    let tx31 = `¿Tuvo contacto estrecho con confirmados de COVID-19 ?: ${data.tuvoContacto}`;
    let tx32 = `¿Con personas con síntomas y/o sospecha CVOID-19?: ${data.tuvoConfirmados}`;
    let tx41 = `¿Visitó algún lugar fuera de lo habitual / por ocasión especial?: ${data.visitoAlgoInusual}`;
    let tx42 = `¿Concurrió a algún centro de salud en los últimos 14 días?: ${data.concurrioCentroSalud}`;

    let tx51 = `Su trabajo es: `;
    let tx52 = `Profesional/Técnico de la Salud: `;
    let tx53 = `Trabaja en Hosp/clínica asis:`;
    let tx54 = `Inst peniten: `;
    let tx55 = `Inst sal mental:`;
    let tx56 = `Resid p/mayores:`;

    doc.fillColor(BLACK)
        .fontSize(font_size);
    doc.text(tx11, margin_left + 1,    y + 0 * offset);
    doc.text(tx12, margin_left + 142,  y + 0 * offset);

    //doc.text(tx51, margin_left + 1,    y   + offset);

    doc.text(tx52, margin_left + 1,    y   + offset);
    doc.rect(      margin_left + 132,  y-2 + offset, 12, 12).stroke();

    doc.text(tx53, margin_left + 156,   y   + offset);
    doc.rect(      margin_left + 274,   y-2 + offset, 12, 12).stroke();

    doc.text(tx54, margin_left + 293,   y   + offset);
    doc.rect(      margin_left + 345,   y-2 + offset, 12, 12).stroke();

    doc.text(tx55, margin_left + 365,   y   + offset);
    doc.rect(      margin_left + 429,   y-2 + offset, 12, 12).stroke();

    doc.text(tx56, margin_left + 449,   y   + offset);
    doc.rect(      margin_left + 522,   y-2 + offset, 12, 12).stroke();

    doc.font(ROBOTO_BOLD)
        .fontSize(font_size)
        .text(tx21, margin_left + 1,    (y + 3) + 2 * offset);

    doc.font(ROBOTO_REGULAR)
        .fontSize(font_size)
        .text(tx31, margin_left + 1,        (y + 3) + 3 * offset)
        .text(tx32, margin_left + 1 + 280,  (y + 3) + 3 * offset)
        .text(tx41, margin_left + 1,        (y + 3) + 4 * offset)
        .text(tx42, margin_left + 1 + 280,  (y + 3) + 4 * offset);

}


function seccionSIETE(doc, y, data, spec){
    const { margin_left, font_size, bg_col } = spec;
    let offset = 15;
    let fsize = 12;
    let vinculos = data.vinculos;
    let minRows = 5;

    doc.fillColor(bg_col)
        .fontSize(fsize);

    rowTable(doc, margin_left, y-1, {nombre: 'Apellido y nombre', edad: 'Edad', vinculo: 'Parentesco/ Vínculo', comentario: 'Comentario' })

    doc.fillColor(BLACK)
        .fontSize(font_size);

    let index = 1;
    for(let vinculo of vinculos){
        rowTable(doc, margin_left, (y + 20 * index)-1, vinculo);
        index += 1;
        if(index>minRows) break;
    }

    for(let i = index; i <= minRows; i++){
        rowTable(doc, margin_left, (y + 20 * i)-1, null);
    }
}

function seccionOCHO(doc, y, data, spec){
    const { margin_left, font_size, bg_col } = spec;
    let offset = 15;
    let fsize = 10;

    let tx11 = `Nexo epidemiológico: `;
    let tx12 = `Laboratorio: `;

    let tx21 = `Tipo de muestra tomada: `;
    let tx22 = `Hisopado nasofaríngeo:`;
    let tx23 = `Aspirado:`;
    let tx24 = `Esputo:`;
    let tx25 = `Sangre:`;
    let tx26 = `Lavado broncoalveolar:`;
    let tx27 = `Otra: ............................................. `;

    let tx31 = `Fecha de toma de muestra: ${ data.fechalab }              Lugar de toma de la muestra: ${ data.muestra }  `;
    let tx32 = `Fecha en que se deriva la muestra:  ...../...../.....  Lugar de derivación:.............................................  Fecha de derivación al LNR: ...../...../..... `;

    let tx51 = `Datos de la persona que notifica:`;
    let tx52 = `Nombre y apellido:`;
    let tx53 = `Firma y sello:`;



    doc.fillColor(bg_col)
        .fontSize(fsize);

    doc.text(tx11, margin_left + 1,  y + 0 * offset);
    doc.rect(margin_left + 100, y-2, 12, 12).stroke();

    doc.text(tx12, margin_left + 130,  y + 0 * offset);
    doc.rect(margin_left + 188, y-2, 12, 12).stroke();

    //
    doc.text(tx21, margin_left + 1,  y + 1 * offset);        
    doc.fillColor(BLACK)
         .fontSize(font_size);

    doc.text(tx22, margin_left + 120,  (y + 1) + 1 * offset);
    doc.rect(margin_left + 219,        (y - 1) + 1 * offset, 12, 12).stroke();

    doc.text(tx23, margin_left + 239,  (y + 1) + 1 * offset);
    doc.rect(margin_left + 279,        (y - 1) + 1 * offset, 12, 12).stroke();
    
    doc.text(tx24, margin_left + 298,  (y + 1) + 1 * offset);
    doc.rect(margin_left + 331,        (y - 1) + 1 * offset, 12, 12).stroke();

    doc.text(tx25, margin_left + 351,  (y + 1) + 1 * offset);
    doc.rect(margin_left + 384,        (y - 1) + 1 * offset, 12, 12).stroke();
    
    doc.text(tx27, margin_left + 410,  (y + 1) + 1 * offset);

    doc.text(tx31, margin_left + 1,  (y + 1) + 2 * offset);
    doc.text(tx32, margin_left + 1,  (y + 1) + 3 * offset);

    // Firma
    doc.fillColor(bg_col)
        .fontSize(fsize);
    doc.text(tx51, margin_left + 1,  (y + 1) + 5 * offset);

    doc.fillColor(BLACK)
         .fontSize(font_size);
    doc.text(tx52, margin_left + 160,  (y + 1) + 5 * offset);
    doc.text(tx53, margin_left + 370,  (y + 1) + 5 * offset);
            
    
}

// deprecated
function seccionNUEVE(doc, y, data, spec){
    const { margin_left, font_size } = spec;
    let offset = 5;
    let fsize = 8;
    let tx11 = `Nombre del centro de aislamiento:.......................... Nro de casos en el grupo familiar: ........... `;
    let tx21 = `Incluye personal asistencial, técnico, administrativo, de maestranza, de limpieza de instituciones de saldu, laboratorios, residencias de adultos mayores y neuropsiquiátricos.`;

    doc.fillColor(BLACK)
        .fontSize(font_size);
    doc.text(tx11, margin_left + 1,  (y) + 0 * offset);

    doc.fillColor(GRIS_1)
        .fontSize(fsize);
    doc.text(tx21, margin_left + 1,  (y+5) + 1 * offset);    
}

function seccionCIERRE(doc, y, data, spec){
    const { margin_left, font_size, actualWidth, bg_col } = spec;
    let offset = 15;
    let fsize = 12;

    let tx12 = `PÁGINA 1 / 1`;
    let tx11 = `Secretaría de Salud :: Municipalidad de Almirante Brown :: formulario-20-1 :: rev 2021-01`;
    let tx13 = `ESTA DOCUMENTO NO CONSTITUYE PERMISO DE CIRCULACIÓN. VÉASE: `;
    let tx14 = `https://www.argentina.gob.ar/circular`;

    doc.moveTo(margin_left, y).strokeColor('#dfdfdf')
                    .lineTo(actualWidth - margin_left, y).stroke();

    doc.fillColor(GRIS_2)
        .fontSize(9);
    doc.text(tx11, margin_left + 1,  (y+2) + 0 * offset);

    doc.fillColor(bg_col)
        .fontSize(fsize);
    doc.text(tx12, margin_left + 450,  (y+2) + 0 * offset);

    doc.fillColor(GRIS_1)
        .fontSize(10)
        .text(tx13, margin_left + 1,  (y) + 1 * offset, {continued: true})
        .text(tx14, {
            link: DEFINICION_CASO
         });


}



/**************************************/
/***** HELPER FUNCTIONS             **/
/************************************/
function sino(doc, x, y, spec){
    doc.fillColor(BLACK)
        .fontSize(spec.font_size);
    doc.text('SI', x, y);
    doc.rect(x+10, y-2, 12, 12).stroke();
    doc.text('NO', x+26, y);
    doc.rect(x+40, y-2, 12, 12).stroke();
}

function sectionTitle(doc, y, title,  spec){
    const { margin_left, margin_default, font_size, bg_col } = spec;
    doc.fillColor(bg_col)
        .fontSize(14);

    let yt = y + 2;
    let tx = doc.widthOfString(title, {})
    let xt = (595 + margin_left - margin_default - tx) / 2;

    doc.rect(margin_left, y, (595 - (margin_left + margin_default)), 18).stroke();
    doc.text(title, xt, yt);
}

function rowTable(doc, x, y, data){
    doc.rect(x       ,y, 150, 20);
    doc.rect(x + 150 ,y, 60 , 20);
    doc.rect(x + 210 ,y, 150, 20);
    doc.rect(x + 360 ,y, 184, 20).stroke();
    if(data){
        doc.text(data.nombre,      x + 20,       y + 3);
        doc.text(data.edad,        x + 150 + 20, y + 3);
        doc.text(data.vinculo,     x + 210 + 20, y + 3);
        doc.text(data.comentario,  x + 360 + 20, y + 3);
    }
}



/**************************************/
/***** DATA BUILDER                 **/
/************************************/

function mapQueryToHisopadoData(asis, person){
    const data = getMockData();
    const today = new Date();

    const locacion = asis.locacion || {
            city: '...........................',
            street1: '........................',
            barrio: '.........................',
            zip: '............................'
        };

    const edad = utils.edadActual(utils.parseDateStr(asis.fenactx)) || 's/d';
    const infeccion = asis.infeccion;
    if(infeccion){
        data.fe_inicio = infeccion.fe_inicio;
        data.diasAislamiento = Math.floor((today.getTime() - infeccion.fets_inicio) / (1000 * 60 * 60 * 24));


    }

    data.outputFile = savePath  + '/constanciaAlta-' + asis.compNum + '.pdf';

    let city = ciudadesBrown.find(t => t.val === locacion.city)

    data.fechaemision = utils.dateToStr(today);
    data.displayAs = asis.requeridox.slug || person.displayName;
    data.sexo = asis.sexo || ' [ F ]  [ M ]';
    data.ndoc = asis.ndoc;
    data.nacionalidad =     'Argentino/a';
    data.provincia =        'Buenos Aires';
    data.departamento =     'Almirante Brown';
    data.city =             city ? city.label :  locacion.city;
    data.barrio =           locacion.barrio;
    data.street1 =          locacion.street1;
    data.zip =              locacion.zip;
    data.telefono =         asis.telefono || '';
    data.fenac =            asis.fenactx || '';
    data.edad =             edad;
    data.compNum =          asis.compNum;
    data.locacion1 = data.street1 + (data.barrio ? ', ' + data.barrio : ''); 
    data.locacion2 = data.city + ', ' + data.departamento; 
    return data;
}

function getMockData(){
    const data = {
        nombre: 'Jorge',
        apellido: 'Alemán',
        displayAs: 'Aleman, Jorge Enrique',
        sexo: 'M',
        ndoc: '22333444',
        nacionalidad: 'Argentino',
        provincia: 'Buenos Aires',
        departamento: 'Almirante Brown',
        locacion: 'calle Nro, barrio, localidad, Almirante Brown',
        city: 'Adrogué',
        barrio: 'Adrogué Centro',
        street1: 'Espora 1312',
        zip: '1856',
        telefono: '1133334444',
        fenac:  '12/12/2000',
        edad: "22",
        compNum: '10000',

        fe_inicio: '04/08/2020',
        outputFile: 'constanciaAlta.pdf',


    }
    return data;

}
