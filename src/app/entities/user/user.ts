
export interface CurrentCommunity {
	id:string;
	name:string;
	slug:string;
	displayAs:string;
}

interface VerifiedUser {
	mail: boolean,
	feaprobado: number,
	adminuser: string
}

interface GoogleProfile {
    id:           string,
    kind:         string,
    etag:         string,
    displayName:  string,
    url:          string,
    language:     string,
    gender:       string,
    name:         object,
    image:        object,
    emails:       Array<any>,
    photos:       Array<any>,
    cover:        object,
}


/*********
    username:       { type: String, required: true },
    provider:       { type: String, default: 'local' },
    providerId:     { type: String, required: false },
    accessToken:    { type: String, required: false },

    email:          { type: String, required: true },
    password:       { type: String, required: true },

    displayName:    { type: String, required: true },
    description:    { type: String, required: false },
    cellphone:      { type: String, required: false },

    communityId:    { type: String, required: false },
    grupos:         { type: String, required: false },
    roles:          { type: String, required: false },
    modulos:        { type: String, required: false },
    moduleroles:    { type: Array,  required: false },
    language:       { type: String, required: false },

    fealta:         { type: Date,    default: Date.now },
    termscond:      { type: Boolean,required: false },
    estado:         { type: String, required: true },
    navance:        { type: String, required: true },
    localProfile:   { type: Boolean, default: false},
    externalProfile:{ type: Boolean, default: false},

    avatarUrl:      { type: String, required: false },
    googleProfile:  { type: googleProfileSch, required: false},

    verificado:     {
                        mail: Boolean,
                        feaprobado: Number,
                        adminuser: String
                    },

    currentCommunity: {
                        id: String,
                        name: String,
                        slug: String,
                        displayAs: String
                    }

});


*******/

export class User {
	id: string;
	_id: string;
	username: string;
	email: string;
	provider: string;
	providerId: string;
	accessToken: string;
	displayName: string;
	description: string;
	cellphone: string;
	password: string;
	termscond: boolean;
	estado: string;
	navance: string;
	confirmPassword: string;
	grupos: string;
	roles: string;
	modulos: string;
	language: string = 'es';
	moduleroles: Array<any>;
	fealta: number;
	communityId: string;
	communityUrlpath: string;
	personId: string;
	verificado: VerifiedUser;
	currentCommunity: CurrentCommunity;
	localProfile:  boolean;
	externalProfile:boolean;
	avatarUrl: string;
	googleProfile:GoogleProfile;


	constructor(
		usuario: string,
		correo: string,
		commty?: CurrentCommunity ){
			this.username = usuario || 'anónimo';
			this.email = correo || 'invitado@develar';
			this.termscond = false;
			this.estado = "pendiente";
			this.navance = "webform";
			this.roles = "";
			this.accessToken = "";
			this.modulos = "";
			this.grupos = "";
			this.fealta = Date.now();
			this.moduleroles = [];
			this.localProfile = false;
			this.externalProfile = false;
			this.avatarUrl = '';
			this.description = '';
			this.cellphone = '';

			if(commty){
				this.currentCommunity = commty;
			}else{
				this.currentCommunity = {
					id: null,
					name:'develar',
					slug:'develar',
					displayAs:'develar'
				}
			}
			this.verificado = {
				mail: false,
				feaprobado: Date.now(),
				adminuser: ''
			}
	}
}
