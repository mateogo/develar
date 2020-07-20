const monedas = [
			{val: 'ARS',    label: 'pesos',           slug:'Pesos Argentinos' },
			{val: 'USD',    label: 'usd',             slug:'Dolar USA' },
			{val: 'EUR',    label: 'euros',           slug:'Euros' },
			{val: 'BRL',    label: 'reales',          slug:'Reales' },
			{val: 'COP',    label: 'pesosCo',         slug:'Pesos Colombianos' },
			{val: 'UYU',    label: 'pesosUy',         slug:'Pesos Uruguayos' },
			{val: 'CLP',    label: 'pesosCl',         slug:'Pesos Chilenos' },
]


const fumeList = [
        {val:'no_definido'  , label:'Unidad de Medida'},
        {val:'unidad'       , label:'UN'},
        {val:'porcentaje'   , label:'%'},
        {val:'hora'         , label:'hs'},
        {val:'dia'          , label:'días'},
        {val:'semana'       , label:'sem'},
        {val:'mes'          , label:'mes'},
        {val:'persona'      , label:'per'},
        {val:'espacio'      , label:'amb'},
        {val:'no_definido'  , label:'-------------'},
        {val:'pasaje'       , label:'pje'},
        {val:'alojamiento'  , label:'aloj'},
        {val:'tramo'        , label:'tram'},
];

const semana_labels = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];
const mes_labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul' , 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']; 

const formatDDMMToStr = function(date_num) {
    let prefix = '00';

    let date = date_num ? new Date(date_num) : new Date();

    let da = (prefix+date.getDate()).substr(-prefix.length);

    let mo = date.getMonth();
    

    return  da + '-' + mes_labels[mo];
};


const formatDateToStr = function(date_num) {
    let prefix = '00';

    let date = date_num ? new Date(date_num) : new Date();

    let da = (prefix+date.getDate()).substr(-prefix.length);
    let mo = (prefix+(date.getMonth()+1)).substr(-prefix.length);
    let ye = date.getFullYear();

    let dayOfWeek = date.getDay()

    return semana_labels[dayOfWeek] + ' ' + da + '-' + mo;
};

const dateToStr = function(date) {
    let prefix = '00';
    date = date ? date : new Date();

    let da = (prefix+date.getDate()).substr(-prefix.length);
    let mo = (prefix+(date.getMonth()+1)).substr(-prefix.length);
    let ye = date.getFullYear();
    return da+"/"+mo+"/"+ye;
};

const formattedDate = function(datex: string){
    let date = parseDateStr(datex);
    return date ? dateToStr(date) : '';
}

const dateToInvertedStr = function(date) {
    let prefix = '00';
    date = date ? date : new Date();

    let da = (prefix+date.getDate()).substr(-prefix.length);
    let mo = (prefix+(date.getMonth()+1)).substr(-prefix.length);
    let ye = date.getFullYear();
    return ye + '-' + mo + '-' + da;
};

const rangoFechasDocumento = {
    DNI: [
        {de:  100000, hasta:  9999999, nacido: '1/1/1920' },
        {de: 10000000, hasta:13999999, nacido: '1/1/1950' },
        {de: 14000000, hasta:19999999, nacido: '1/1/1960' },
        {de: 20000000, hasta:24999999, nacido: '1/1/1970' },
        {de: 25000000, hasta:29999999, nacido: '1/1/1975' },
        {de: 30000000, hasta:34999999, nacido: '1/1/1980' },
        {de: 35000000, hasta:39999999, nacido: '1/1/1990' },
        {de: 40000000, hasta:44999999, nacido: '1/1/2001' },
        {de: 45000000, hasta:99999999, nacido: '1/1/2010' },
    ]

}

const searchBestDoB = function(tdoc, ndoc): string{
    let fenac = '';
    let list = [];
    let token;
    let numdoc = parseInt(ndoc, 10);
    if(isNaN(numdoc)) numdoc = 0;

    if(tdoc && ndoc){
        list = rangoFechasDocumento[tdoc];
        if(list && list.length){
            token = list.find(t => t.de <= numdoc && numdoc <= t.hasta );
            fenac = token ? token.nacido : '';
        }

    }
    return fenac;
}

/******
const 
1.000.000 a 2.000.000 ;1921

10.000.001 a 10500000 ;1951

10500001 a 11000000 ;1951

11000001 a 11500000 ;1953

11500001 a 12000000 ;1954

12000001 a 12500000 ;1956

12500001 a 13000000 ;1956

13000001 a 13500000 ;1957

13500001 a 14000000 ;1958

14000001 a 14500000 ;1959

14500001 a 15000000 ;1959

15000001 a 15500000 ;1960

15500001 a 16000000 ;1961

16000001 a 16500000 ;1961

16500001 a 17000000 ;1962

17000001 a 17500000 ;1963

17500001 a 18000000 ;1964

18000001 a 18500000 ;1965

18500001 a 19000000 ;1965

19000001 a 19500000 ;1966

19500001 a 20000000 ;1966

20000001 a 20500000 ;1967

2000001 a 2500000 ;1920

20500001 a 21000000 ;1968

21000001 a 21500000 ;1969

21500001 a 22000000 ;1969

22000001 a 22500000 ;1970

22500001 a 23000000 ;1971

23000001 a 23500000 ;1972

23500001 a 24000000 ;1973

24000001 a 24500000 ;1973

24500001 a 25000000 ;1974

25000001 a 25500000 ;1975

2500001 a 3000000 ;1921

25500001 a 26000000 ;1976

26000001 a 26500000 ;1977

26500001 a 27000000 ;1977

27000001 a 27500000 ;1978

27500001 a 28000000 ;1979

28000001 a 28500000 ;1979

28500001 a 29000000 ;1980

29000001 a 29500000 ;1981

29500001 a 30000000 ;1982

30000001 a 30500000 ;1982

3000001 a 3500000 ;1922

30500001 a 31000000 ;1983

31000001 a 31500000 ;1984

31500001 a 32000000 ;1984

32000001 a 32500000 ;1985

32500001 a 33000000 ;1986

33000001 a 33500000 ;1987

33500001 a 34000000 ;1987

34000001 a 34500000 ;1988

34500001 a 35000000 ;1989

3500001 a 4000000 ;1922

35500001 a 36000000 ;1990

36000001 a 36500000 ;1991

36500001 a 37000000 ;1991

37000001 a 37500000 ;1992

37500001 a 38000000 ;1993

38000001 a 38500000 ;1993

38500001 a 39000000 ;1994

39000001 a 39500000 ;1995

39500001 a 40000000 ;1995

40000001 a 40500000 ;1996

4000001 a 4500000 ;1932

40500001 a 41000000 ;1997

41000001 a 41500000 ;1997

41500001 a 42000000 ;1998

42000001 a 42500000 ;1998

42500001 a 43000000 ;1996

43000001 a 43500000 ;1996

43500001 a 44000000 ;1997

44000001 a 44500000 ;1999

44500001 a 45000000 ;2000

45000001 a 45500000 ;2001

4500001 a 5000000 ;1937

45500001 a 46000000 ;2002

46000001 a 46500000 ;2004

46500001 a 47000000 ;2005

5000001 a 5500000 ;1936

5500001 a 6000000 ;1935

6000001 a 6500000 ;1936

6500001 a 7000000 ;1938

7000001 a 7500000 ;1941

7500001 a 8000000 ;1945

8000001 a 8500000 ;1947

8500001 a 9000000 ;1948

9000001 a 9500000 ;1949

9500001 a 10000000 ;1950

 

****/

const parseDateStr = function(str) {
    if(!str) return null;
    let mx = str.match(/(\d+)/g);
    let ty = new Date();
    if(mx.length === 0) return ty;
    if(mx.length === 1){
        if(mx[0]<0 || mx[0]>31) return null;
        else return new Date(ty.getFullYear(),ty.getMonth(),mx[0]);
    }
    if(mx.length === 2){
        if(mx[0]<0 || mx[0]>31) return null;
        if(mx[1]<0 || mx[1]>12) return null;
        else return new Date(ty.getFullYear(),mx[1]-1,mx[0]);
    }
    if(mx.length === 3){
        if(mx[0]<0 || mx[0]>31) return null;
        if(mx[1]<0 || mx[1]>12) return null;
        if(mx[2]<1000 || mx[2]>2100) return null;
        else return new Date(mx[2],mx[1]-1,mx[0]);
    }
    if(mx.length === 4){
        if(mx[0]<0 || mx[0]>31) return null;
        if(mx[1]<0 || mx[1]>12) return null;
        if(mx[2]<1000 || mx[2]>2100) return null;
        if(mx[3]<0 || mx[3]>24) return null;
        else return new Date(mx[2],mx[1]-1,mx[0],mx[3],0);
    }
    if(mx.length === 5){
        if(mx[0]<0 || mx[0]>31) return null;
        if(mx[1]<0 || mx[1]>12) return null;
        if(mx[2]<1000 || mx[2]>2100) return null;
        if(mx[3]<0 || mx[3]>24) return null;
        if(mx[4]<0 || mx[4]>60) return null;
        else return new Date(mx[2],mx[1]-1,mx[0],mx[3],mx[4]);
    }
}


function umeTx(ume, fume, fumetx, qt, freq){
    let text = ""
    if(freq === 1 && fume === 'unidad'){
        text = qt + ' ' + ume
    }else {
        text = qt + ' ' + ume + ' x ' + freq + ' ' + fumetx ;
    }
    return text;
}

// si plus_day === 0, entonces devuelve la fecha de fin de mes, acorde al mes computado.
// si plus_day !== 0, entonces la suma, a modo de corrimiento, respecto del día actual.
function getProjectedDate(date: Date, plus_day:number, plus_month:number){
    plus_day = plus_day || 0;
    plus_month = plus_month || 0;

    if(plus_day) {
        date.setMonth(date.getMonth() + plus_month, date.getDate() + plus_day);

    }else {
        date.setMonth(date.getMonth() + plus_month, 0);

    }
}

function buildFecharefLabel(fecharef: Date): string{
    let dayOfWeek = fecharef.getDay(); // 0-6 <==> DOM-SAB
    let actualDay = fecharef.getDate(); // Día del mes calendario 1-31|30|28|29

    let semana_inicia =  actualDay - dayOfWeek + ((dayOfWeek === 0) ? -6 : 1);
    let semana_finaliza = actualDay + (6 - dayOfWeek ) + ((dayOfWeek === 0) ? -6 : 1);

    let desde = new Date(fecharef.getTime())
    desde.setDate(semana_inicia);    // retorna fecha en formato number
    let hasta = new Date(fecharef.getTime())
    hasta.setDate(semana_finaliza);  // en milisegundos

    return `Semana referencia:  Lunes ${devutils.txFromDate(desde)} a Domingo ${devutils.txFromDate(hasta)}   `
}

function buildDateFromTo(fecharef: Date): {feDesde: string, feHasta: string}{
    let dayOfWeek = fecharef.getDay(); // 0-6 <==> DOM-SAB
    let actualDay = fecharef.getDate(); // Día del mes calendario 1-31|30|28|29

    let semana_inicia =  actualDay - dayOfWeek ;
    let semana_finaliza = actualDay + (6 - dayOfWeek );

    let desde = new Date(fecharef.getTime())
    desde.setDate(semana_inicia);    // retorna fecha en formato number

    let hasta = new Date(fecharef.getTime())
    hasta.setDate(semana_finaliza);  // en milisegundos
    return { feDesde: dateToStr(desde), feHasta: dateToStr(hasta) }
}

function buildEpidemioWeek(fecharef: Date): string{
    let dayOfWeek = fecharef.getDay(); // 0-6 <==> DOM-SAB
    let actualDay = fecharef.getDate(); // Día del mes calendario 1-31|30|28|29

    let semana_inicia =  actualDay - dayOfWeek ;
    let semana_finaliza = actualDay + (6 - dayOfWeek );

    let desde = new Date(fecharef.getTime())
    desde.setDate(semana_inicia);    // retorna fecha en formato number

    let hasta = new Date(fecharef.getTime())
    hasta.setDate(semana_finaliza);  // en milisegundos

    let week = getEpidemicWeekOfTheYear(fecharef)

    return `Semana epidemiológica #${week}:  Domingo ${devutils.txFromDate(desde)} a Sábado ${devutils.txFromDate(hasta)} `
}

function getEpidemicWeekOfTheYear(fecharef:Date ): number{
    let weeks = 0;
    let from = fecharef.getTime();
    let firstOfYear_date = new Date(fecharef.getFullYear(), 0, 1);

    let begin_of_year = getBeginOfYear(new Date(fecharef.getFullYear()+1, 0, 1));
    if(begin_of_year <= from){
        return getEpidemioWeek(begin_of_year, from);
    }

    begin_of_year = getBeginOfYear(firstOfYear_date);

    if(begin_of_year > from){
        begin_of_year = getBeginOfYear(new Date(fecharef.getFullYear()-1, 0, 1));
    }

    return getEpidemioWeek(begin_of_year, from);
}

function getEpidemioWeek(begin, fecharef){
    return Math.floor((fecharef - begin) / (1000 * 60 * 60 * 24 * 7)) + 1;
}

function getBeginOfYear(firstOfYear: Date): number{
    let dow = firstOfYear.getDay();
    let begin_of_year: number; 

    //c onsole.log('FirstDayOfYear [%s] dow:[%s]', firstOfYear.toString(), dow);
    if(dow < 4) { // esta semana ya pertenece al año Nuevo
        begin_of_year = firstOfYear.setDate(firstOfYear.getDate() - dow)
        //c onsole.log('Semana Incluida: El año empezó el día [%s] [%s]', dow, new Date(begin_of_year).toString() );


    }else {
        begin_of_year = firstOfYear.setDate(firstOfYear.getDate() + (7 - dow));
        //c onsole.log('Semana siguiente El año empezó el día [%s] [%s]', dow, new Date(begin_of_year).toString() )
    }
    return begin_of_year;
}

// feriados
const inactivosList = ["31/03/2020", "10/04/2020", "01/05/2020", "25/05/2020", "15/06/2020", "09/07/2020", "10/07/2020"]
const laborDayOfWeek = [0, 1, 1, 1, 1, 1, 0]

function nextLaborDay(date: Date, offset): Date{
    let day = date.getDate();
    let m = date.getMonth();
    let y = date.getFullYear();
    let blackList = inactivosList.map(t => devutils.dateFromTx(t));

    for(let i = 0; i < 10; i += 1){
        let dd = day + i + offset;
        let test = new Date(y, m, dd);
        if(laborDayOfWeek[test.getDay()]){
            let inac = blackList.find(t => t.getTime() == test.getTime())
            if(!inac) return test;
        }
    }
    return null;

}

function timeOutOfScope():boolean {
    let ok = false;
    let today = new Date();

    let d = today.getDate();
    let m = today.getMonth();
    let y = today.getFullYear();
    let test = new Date(y, m, d);    

    let blackList = inactivosList.map(t => devutils.dateFromTx(t));
    let inac = blackList.find(t => t.getTime() === test.getTime())
    if(inac) ok = true;

    let hours = today.getHours();
    let dow = today.getDay()

    if((hours>=14 || hours < 8) || (dow < 1 || dow > 5) ){
      ok = true;

    } 

    return ok;

}


/***
Australia Dollar 	AUD
Great Britain Pound 	GBP
Euro 	EUR
Japan Yen 	JPY
Switzerland Franc 	CHF
USA Dollar 	USD
Afghanistan Afghani 	AFN
Albania Lek 	ALL
Algeria Dinar 	DZD
Angola Kwanza 	AOA
Argentina Peso 	ARS
Armenia Dram 	AMD
Aruba Florin 	AWG
Australia Dollar 	AUD
Austria Schilling 	ATS (EURO)
Belgium Franc 	BEF (EURO)
Azerbaijan New Manat 	AZN
Bahamas Dollar 	BSD
Bahrain Dinar 	BHD
Bangladesh Taka 	BDT
Barbados Dollar 	BBD
Belarus Ruble 	BYR
Belize Dollar 	BZD
Bermuda Dollar 	BMD
Bhutan Ngultrum 	BTN
Bolivia Boliviano 	BOB
Bosnia Mark 	BAM
Botswana Pula 	BWP
Brazil Real 	BRL
Great Britain Pound 	GBP
Brunei Dollar 	BND
Bulgaria Lev 	BGN
Burundi Franc 	BIF
CFA Franc BCEAO 	XOF
CFA Franc BEAC 	XAF
CFP Franc 	XPF
Cambodia Riel 	KHR
Canada Dollar 	CAD
Cape Verde Escudo 	CVE
Cayman Islands Dollar 	KYD
Chili Peso 	CLP
China Yuan/Renminbi 	CNY
Colombia Peso 	COP
Comoros Franc 	KMF
Congo Franc 	CDF
Costa Rica Colon 	CRC
Croatia Kuna 	HRK
Cuba Convertible Peso 	CUC
Cuba Peso 	CUP
Cyprus Pound 	CYP (EURO)
Czech Koruna 	CZK
Denmark Krone 	DKK
Djibouti Franc 	DJF
Dominican Republich Peso 	DOP
East Caribbean Dollar 	XCD
Egypt Pound 	EGP
El Salvador Colon 	SVC
Estonia Kroon 	EEK (EURO)
Ethiopia Birr 	ETB
Euro 	EUR
Falkland Islands Pound 	FKP
Finland Markka 	FIM (EURO)
Fiji Dollar 	FJD
Gambia Dalasi 	GMD
Georgia Lari 	GEL
Germany Mark 	DMK (EURO)
Ghana New Cedi 	GHS
Gibraltar Pound 	GIP
Greece Drachma 	GRD (EURO)
Guatemala Quetzal 	GTQ
Guinea Franc 	GNF
Guyana Dollar 	GYD
Haiti Gourde 	HTG
Honduras Lempira 	HNL
Hong Kong Dollar 	HKD
Hungary Forint 	HUF
Iceland Krona 	ISK
India Rupee 	INR
Indonesia Rupiah 	IDR
Iran Rial 	IRR
Iraq Dinar 	IQD
Ireland Pound 	IED (EURO)
Israel New Shekel 	ILS
Italy Lira 	ITL (EURO)
Jamaica Dollar 	JMD
Japan Yen 	JPY
Jordan Dinar 	JOD
Kazakhstan Tenge 	KZT
Kenya Shilling 	KES
Kuwait Dinar 	KWD
Kyrgyzstan Som 	KGS
Laos Kip 	LAK
Latvia Lats 	LVL (EURO)
Lebanon Pound 	LBP
Lesotho Loti 	LSL
Liberia Dollar 	LRD
Libya Dinar 	LYD
Lithuania Litas 	LTL (EURO)
Luxembourg Franc 	LUF (EURO)
Macau Pataca 	MOP
Macedonia Denar 	MKD
Malagasy Ariary 	MGA
Malawi Kwacha 	MWK
Malaysia Ringgit 	MYR
Maldives Rufiyaa 	MVR
Malta Lira 	MTL (EURO)
Mauritania Ouguiya 	MRO
Mauritius Rupee 	MUR
Mexico Peso 	MXN
Moldova Leu 	MDL
Mongolia Tugrik 	MNT
Morocco Dirham 	MAD
Mozambique New Metical 	MZN
Myanmar Kyat 	MMK
NL Antilles Guilder 	ANG
Namibia Dollar 	NAD
Nepal Rupee 	NPR
Netherlands Guilder 	NLG (EURO)
New Zealand Dollar 	NZD
Nicaragua Cordoba Oro 	NIO
Nigeria Naira 	NGN
North Korea Won 	KPW
Norway Kroner 	NOK
Oman Rial 	OMR
Pakistan Rupee 	PKR
Panama Balboa 	PAB
Papua New Guinea Kina 	PGK
Paraguay Guarani 	PYG
Peru Nuevo Sol 	PEN
Philippines Peso 	PHP
Poland Zloty 	PLN
Portugal Escudo 	PTE (EURO)
Qatar Rial 	QAR
Romania New Lei 	RON
Russia Rouble 	RUB
Rwanda Franc 	RWF
Samoa Tala 	WST
Sao Tome/Principe Dobra 	STD
Saudi Arabia Riyal 	SAR
Serbia Dinar 	RSD
Seychelles Rupee 	SCR
Sierra Leone Leone 	SLL
Singapore Dollar 	SGD
Slovakia Koruna 	SKK (EURO)
Slovenia Tolar 	SIT (EURO)
Solomon Islands Dollar 	SBD
Somali Shilling 	SOS
South Africa Rand 	ZAR
South Korea Won 	KRW
Spain Peseta 	ESP (EURO)
Sri Lanka Rupee 	LKR
St Helena Pound 	SHP
Sudan Pound 	SDG
Suriname Dollar 	SRD
Swaziland Lilangeni 	SZL
Sweden Krona 	SEK
Switzerland Franc 	CHF
Syria Pound 	SYP
Taiwan Dollar 	TWD
Tanzania Shilling 	TZS
Thailand Baht 	THB
Tonga Pa'anga 	TOP
Trinidad/Tobago Dollar 	TTD
Tunisia Dinar 	TND
Turkish New Lira 	TRY
Turkmenistan Manat 	TMM
USA Dollar 	USD
Uganda Shilling 	UGX
Ukraine Hryvnia 	UAH
Uruguay Peso 	UYU
United Arab Emirates Dirham 	AED
Vanuatu Vatu 	VUV
Venezuela Bolivar 	VEB
Vietnam Dong 	VND
Yemen Rial 	YER
Zambia Kwacha 	ZMK
Zimbabwe Dollar 	ZWD
****/
 

class Devutils {

	get currencies(){
		return monedas;
	}

	get fumelist(){
		return fumeList;

	}

    dateFromTx(datex){
        return parseDateStr(datex);
    }

    dateNumFromTx(datex){
        let fecha =  parseDateStr(datex);
        if(fecha) return fecha.getTime();
        else return 0;
    }

    dateNumPlusOneFromTx(datex){
        let fecha =  parseDateStr(datex);
        if(fecha) {
            fecha.setDate(fecha.getDate() + 1);
            return fecha.getTime();
        }
        else return 0;
    }

	txFromDate(date){
		return dateToStr(date);
	}

    txInvertedFromDate(date){
        return dateToInvertedStr(date);
    }

    txFormatted(datex){
        return formattedDate(datex);
    }

    txDayFormatFromDate(date_num){
        return formatDateToStr(date_num);
    }

    txDayMonthFormatFromDateNum(date_num){
        return formatDDMMToStr(date_num);
    }

    txFromDateTime(time: number){
        return dateToStr(new Date(time));
    }



    dateWeekFromTo(datex ){
        return buildDateFromTo(datex);
    }

    txForCurrentWeek(date: Date):string {
        return buildFecharefLabel(date);
    }

    txForEpidemioWeek(date: Date):string {
        return buildEpidemioWeek(date);
    }

    epidemioWeekCount(date: Date):number {
        return getEpidemicWeekOfTheYear(date);
    }

    nextLaborDate(date: Date, offset: number){
        offset = offset || 0;
        return nextLaborDay(date, offset);
    }

    timeOutOfScope(): boolean{
        return timeOutOfScope();
    }

    isWithinPeriod(fd, fh): boolean{
        if(!fd || !fh) return false;
        let ok = true;

        let lower = this.dateFromTx(fd);
        let upper = this.dateFromTx(fh);
        let check = this.dateFromTx(this.txFromDate(new Date()));
        if(check < lower || check >upper) ok = false

        return ok;
    }

    projectedDate(date: Date, d:number, m:number){
        return getProjectedDate(date, d, m);
    }

    evaluateEdad = function(fenac: string, tdoc?:string, ndoc?:string):string { 
        let edad = '';

        if(this.validAge(fenac)){
             edad = this.edadActual(this.dateFromTx(fenac)) + '';

        }else {
            fenac = searchBestDoB(tdoc, ndoc);

            if(fenac){
                edad = this.edadActual(this.dateFromTx(fenac)) + ' aprox';
            }

        }
        return edad;
    }

    edadActual(dob: Date){
        if(!dob) return null;
        let diff_ms = Date.now() - dob.getTime();
        let age_dt = new Date(diff_ms); 
      
        return Math.abs(age_dt.getUTCFullYear() - 1970);
    }

    validAge(value:string): boolean{
        let validAge = false;
        if(value){
            let today = Date.now();
            let date = this.dateFromTx(value);
            if(date && date.getTime() < today){
                let edad = this.edadActual(new Date(date.getTime()));
                if(edad>=0 && edad<110) validAge = true;
            }
        }

        return validAge;
    }

    txNormalize(datex: string){
        return this.txFromDate(this.dateFromTx(datex))
    }

}

export const devutils = new Devutils();
