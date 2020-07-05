import {
		Directive,
		ElementRef,
		EventEmitter,
		HostListener,
		Input,
		OnChanges,
		OnDestroy,
		OnInit,
		Output,
		ViewChild
		}  from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';

import * as MediumEditor from 'medium-editor';
/*
const mediumEditorColorButtons = require('./medium-editor-colorpicker-buttons').get(MediumEditor);

mediumEditorColorButtons: {
TextColorButtonClass: TextColorButtonClass;
ColorPickerFormAbstractClass: ColorPickerFormAbstractClass;
version: string
}
/
const TextColorButtonClass = mediumEditorColorButtons.TextColorButtonClass;
/*

    Medium Editor wrapper directive.
    Examples
    <medium-editor
    [(editorModel)]="textVar"
    [editorOptions]="{'toolbar': {'buttons': ['bold', 'italic', 'underline', 'h1', 'h2', 'h3']}}"
    [editorplaceholder]="placeholderVar">
*/


const DEFAULT_OPTIONS = {
		toolbar: {'buttons': ['bold', 'italic', 'underline', 'pre', 'anchor', 'h1', 'h2', 'h3']},
		/*textcolor?: {
		  colors?: Array<string>;
		  moreColorText?: string;
		  pickerCloseTimeout?: number;
		},*/
		extensions: {
		  //textcolor: new TextColorButtonClass(/* options? */)
		},
		paste: {
			/* This example includes the default options for paste,
			   if nothing is passed this is what it used */
			forcePlainText: true,
			cleanPastedHTML: false,
			cleanReplacements: [],
			cleanAttrs: ['class', 'style', 'dir'],
			cleanTags: ['meta'],
			unwrapTags: []
		},

		buttonLabels: 'fontawesome',
		imageDragging: false,
		placeholder: {
			text: 'Ingrese texto'
		}
}

@Directive({
	selector: 'textarea[mediumEditor]'
})
export class MediumEditorDirective implements OnInit, OnChanges, OnDestroy {

	@Input() editorModel: any;
	@Input() editorOptions: any;
	@Input() toolbar: any;
	@Input() editorplaceholder: string;
	@Input() editorEnabled: boolean = true;
	@Input() formControl: FormControl;
	

	@Output() modelValueChange = new EventEmitter();


	@ViewChild('host') host: any;


	// private options: any = {};
	// private placeholder: string;
	//private content: string;

	// ver uso y correcta implementación de esta variable
	//private lastViewModel: string;

	//private factor: number;
	//private active: boolean;

	private initOptions:any = {};
	private element: HTMLTextAreaElement;
	private editor: any;

	@HostListener('keyup') onKeyUp() {
	    this.updateModel();
	}

	@HostListener('mouseleave') onMouseLeave() {
	    this.updateModel();
	}

	constructor(private el: ElementRef) {

	}

	ngOnInit() {
	    this.element = this.el.nativeElement;
	    //this.element.innerHTML = this.editorModel;

	    if(this.formControl){
	    	this.formControl.valueChanges.subscribe(value =>{
		    	this.editorModel = value;
		    	this.refreshView();
	    	})
	    	if(this.formControl.value) this.editorModel = this.formControl.value;
	    }

	    this.element.value = this.editorModel;

	    Object.assign(this.initOptions, DEFAULT_OPTIONS, (this.editorOptions || {}) );
	    if (this.editorplaceholder) {
	        this.initOptions.placeholder.text = this.editorplaceholder;
	    }

	    /*
	     * toolbar: {
	     *           buttons: ['bold', 'italic', 'underline', 'anchor', 'h1', 'h2', 'h3', 'h4', 'textcolor']
	     *       }
	     */
	    // Global MediumEditor
	    if (this.editorEnabled) {
	    	let that = this;
        this.editor = new MediumEditor('textarea[mediumEditor]', this.initOptions);
        this.editor.subscribe('blur', function(event, editable){
        	that.formControl.setValue(that.editor.getContent());
        });

	    }
	        // {
	        //     toolbar: this.toolbar,
	        //     textcolor?: {
	        //         colors?: Array<string>;
	        //         moreColorText?: string;
	        //         pickerCloseTimeout?: number;
	        //     },
	        //     extensions: {
	        //         //textcolor: new TextColorButtonClass(/* options? */)
	        //     },
	        //     buttonLabels: 'fontawesome',
	        //     imageDragging: false
	        // }
	}

	refreshView() {
	    if (this.editor) {
	        this.editor.setContent(this.editorModel);
	    }
	}

	ngOnChanges(changes): void {
	    // if (changes[this.lastViewModel] && this.editorEnabled) {
	    //     this.lastViewModel = this.editorModel;
	    //     this.refreshView();
	    // }
	}

	/**
	 * Emit updated model
	 */
	updateModel(): void {
	    if (this.editorEnabled) {
	        this.modelValueChange.emit(this.editor.getContent());
	    }
	}

	/**
	 * Remove MediumEditor on destruction of directive
	 */
	ngOnDestroy(): void {
	    if (this.editorEnabled) {
	        this.editor.destroy();
	    }
	}

}