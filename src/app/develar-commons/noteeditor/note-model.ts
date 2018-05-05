/*

type
language
class
h1
h2
todo
viewState
estado
raw
html
editorComp
viewerComp
*/


const noteTypeList: Array<any> = [
		{val: 'no_definido', 	label: 'Seleccione opción',  slug:'Seleccione opción' },
		{val: 'paragraph',    label: 'Párrafo',      slug:'Párrafo' },
		{val: 'snippet',      label: 'Código',       slug:'Código' },
		{val: 'img',          label: 'Imagen',       slug:'Imagen' },
		{val: 'header',       label: 'Sección',      slug:'Sección' },
		{val: 'video',        label: 'Video',        slug:'Video' },
		{val: 'html',         label: 'HTML',         slug:'HTML' },
];

const languageList: Array<any> = [
		{val: 'no_definido', 	label: 'Seleccione opción',  slug:'Seleccione opción' },
		{val: 'javascript', label: 'JS-ES6',      slug:'JS-ES6' },
		{val: 'typescript', label: 'Typescript',  slug:'Typescript' },
		{val: 'php',        label: 'PHP',         slug:'PHP' },
		{val: 'html',       label: 'HTML',        slug:'HTML' },
		{val: 'css',        label: 'CSS',         slug:'CSS' },
		{val: 'scss',       label: 'SCSS',        slug:'SCSS' },
];

const viewStateList: Array<any> = [
		{val: 'no_definido', 	label: 'Seleccione opción',  slug:'Seleccione opción' },
		{val: 'editor',    label: 'Editor',     slug:'Editor' },
		{val: 'compiled',  label: 'Compilado',  slug:'Compilado' },
		{val: 'view',      label: 'Vista',      slug:'Vista' },
];

function getLabel(list, val){
	let sourceList = {
		type: noteTypeList,
		lang: languageList,
		view: viewStateList
	};
	let label = val;
	let token = sourceList[list].find(item => item === val);
	if(token){
		label = token.label;
	}
	return label;
}



export class NotePiece {
	type: string = "paragraph";
	language: string = 'javascript';
	vclass: string = "";
	header: string = "";
	sheader: string = "";
	todo: string = "";
	viewState: string = "editor";
	estado: string = 'activo';
	raw: string = "";
	html: string = "";
	editorComp: string = "";
	viewerComp: string = "";

}

export class NoteCollection {
	pieces: NotePiece[] = [];
}


export class NoteModel {
	get typeList() {return noteTypeList;}
	get langList() {return languageList;}
	get viewList() {return viewStateList;}

	getLabel(list, val) {
		return getLabel(list, val);
	}

	newNotePiece(spec){
		return new NotePiece();
	}

}

export const noteModel = new NoteModel();
