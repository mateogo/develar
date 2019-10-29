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

const dateToStr = function(date) {
    let prefix = '00';
    date = date ? date : new Date();

    let da = (prefix+date.getDate()).substr(-prefix.length);
    let mo = (prefix+(date.getMonth()+1)).substr(-prefix.length);
    let ye = date.getFullYear();
    return da+"/"+mo+"/"+ye;
};

const calcularEdad = function(dob: Date) { 
    let diff_ms = Date.now() - dob.getTime();
    let age_dt = new Date(diff_ms); 
  
    return Math.abs(age_dt.getUTCFullYear() - 1970);
}



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

    edadActual(date: Date){
        return calcularEdad(date);
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

	txFromDate(date){
		return dateToStr(date);
	}

    txFromDateTime(time: number){
        return dateToStr(new Date(time));
    }

    projectedDate(date: Date, d:number, m:number){
        return getProjectedDate(date, d, m);
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
