export const locaciones = [{

	name: 'Hospital 102',
	camas: {
		uti: 10, //unidad de terapia intensiva
		ti: 15,  // terapia intermedia
		conext: 16,
		internacion: 10
	},

	admisionServicios: [
		{
			nombre: 'Cuidados intensivos',
			derivados: 0
		},
		{
			nombre: 'Cuidados intermedios',
			derivados: 1
		},
		{
			nombre: 'Ambulatorios',
			derivados: 4
		},
		{
			nombre: 'Aislamiento',
			derivados: 3
		},
		{
			nombre: 'Pediátricos',
			derivados: 7
		},
	],

	servicios: [
		{
			id: '',
			nombre: 'Terapia intensiva',
			disponibilidadActual: 12,
			disponibilidadTotal: 20
		},
		{
			id: '',
			nombre: 'Terapia intermedia',
			disponibilidadActual: 20,
			disponibilidadTotal: 32
		},
		{
			id: '',
			nombre: 'Internación simple',
			disponibilidadActual: 30,
			disponibilidadTotal: 72
		},
		{
			id: '',
			nombre: 'Aislamiento',
			disponibilidadActual: 15,
			disponibilidadTotal: 28
		},
		{
			id: '',
			nombre: 'Guardia',
			disponibilidadActual: 5,
			disponibilidadTotal: 14
		},
		{
			id: '',
			nombre: 'Pediatría',
			disponibilidadActual: 8,
			disponibilidadTotal: 11
		},
	],

	estado_ocupacion: [
		{
			camaId: '1.1',
			lugar: 'hab-1',
			piso: '1',
			tipo: 'uti',
			estado: 'ocupada',
			paciente: {
				dni: '11222333',
				name: 'jorge lopez',
				diagnostico: ''
			},
			fecha_in: '12/03/2020',
			fecha_out: null,
			fecha_prev_out: '12/04/2020'

		},
		{
			camaId: '2.1',
			tipo: 'uti',
			estado: 'LIBRE',
			paciente: {
				dni: '11222333',
				name: 'margarita sánchez',
				diagnostico: ''
			},
			fecha_in: '25/03/2020',
			fecha_out: null,
			fecha_prev_out: '31/03/2020'

		},
		{
			camaId: '1.2',
			tipo: 'uti',
			estado: 'ocupada',
			paciente: {
				dni: '11222333',
				name: 'estela soldi',
				diagnostico: ''
			},
			fecha_in: '30/03/2020',
			fecha_out: null,
			fecha_prev_out: '12/06/2020'

		},
		{
			camaId: '1.1',
			tipo: 'uti',
			estado: 'ocupada',
			paciente: {
				dni: '11222333',
				name: 'jorgelina Alfieri',
				diagnostico: ''
			},
			fecha_in: '15/03/2020',
			fecha_out: null,
			fecha_prev_out: '12/05/2020'

		},
		{
			camaId: '2.2',
			tipo: 'uti',
			estado: 'ocupada',
			paciente: {
				dni: '11222333',
				name: 'pico  monaco',
				diagnostico: ''
			},
			fecha_in: '12/03/2020',
			fecha_out: null,
			fecha_prev_out: '12/04/2020'

		},

		{
			camaId: '2.3',
			tipo: 'ti',
			estado: 'ocupada',
			paciente: {
				dni: '22334455',
				name: 'Natalia Natalia',
				diagnostico: ''
			},
			fecha_in: '02/04/2020',
			fecha_out: null,
			fecha_prev_out: '12/04/2020'

		},
		{
			camaId: '2.4',
			tipo: 'ti',
			estado: 'ocupada',
			paciente: {
				dni: '33445566',
				name: 'Juan Pérez',
				diagnostico: ''
			},
			fecha_in: '03/04/2020',
			fecha_out: null,
			fecha_prev_out: '15/04/2020'

		},
		{
			camaId: '3.1',
			tipo: 'ti',
			estado: 'ocupada',
			paciente: {
				dni: '44556677',
				name: 'Ricardo Ricardo',
				diagnostico: ''
			},
			fecha_in: '04/04/2020',
			fecha_out: null,
			fecha_prev_out: '21/04/2020'

		},
	]

	
},

{

	name: 'Club A',
	camas: {
		uti: 10, //unidad de terapia intensiva
		ti: 15,  // terapia intermedia
		conext: 16,
		internacion: 10
	},

	admisionServicios: [
		{
			nombre: 'Terapia intensiva',
			derivados: 0
		},
		{
			nombre: 'Terapia intermedia',
			derivados: 1
		},
		{
			nombre: 'Internación simple',
			derivados: 4
		},
		{
			nombre: 'Aislamiento',
			derivados: 3
		},
		{
			nombre: 'Guardia',
			derivados: 7
		},
	],

	servicios: [
		{
			id: '',
			nombre: 'Terapia intensiva',
			disponibilidadActual: 12,
			disponibilidadTotal: 20
		},
		{
			id: '',
			nombre: 'Terapia intermedia',
			disponibilidadActual: 20,
			disponibilidadTotal: 32
		},
		{
			id: '',
			nombre: 'Internación simple',
			disponibilidadActual: 30,
			disponibilidadTotal: 72
		},
		{
			id: '',
			nombre: 'Aislamiento',
			disponibilidadActual: 15,
			disponibilidadTotal: 28
		},
		{
			id: '',
			nombre: 'Guardia',
			disponibilidadActual: 5,
			disponibilidadTotal: 14
		},
	],

	estado_ocupacion: [
		{
			camaId: '1.1',
			lugar: 'hab-1',
			piso: '1',
			tipo: 'uti',
			estado: 'ocupada',
			paciente: {
				dni: '11222333',
				name: 'jorge lopez',
				diagnostico: ''
			},
			fecha_in: '12/03/2020',
			fecha_out: null,
			fecha_prev_out: '12/04/2020'

		},
		{
			camaId: '2.1',
			tipo: 'uti',
			estado: 'LIBRE',
			paciente: {
				dni: '11222333',
				name: 'margarita sánchez',
				diagnostico: ''
			},
			fecha_in: '25/03/2020',
			fecha_out: null,
			fecha_prev_out: '31/03/2020'

		},
		{
			camaId: '1.2',
			tipo: 'uti',
			estado: 'ocupada',
			paciente: {
				dni: '11222333',
				name: 'estela soldi',
				diagnostico: ''
			},
			fecha_in: '30/03/2020',
			fecha_out: null,
			fecha_prev_out: '12/06/2020'

		},
		{
			camaId: '1.1',
			tipo: 'uti',
			estado: 'ocupada',
			paciente: {
				dni: '11222333',
				name: 'jorgelina Alfieri',
				diagnostico: ''
			},
			fecha_in: '15/03/2020',
			fecha_out: null,
			fecha_prev_out: '12/05/2020'

		},
		{
			camaId: '2.2',
			tipo: 'uti',
			estado: 'ocupada',
			paciente: {
				dni: '11222333',
				name: 'pico  monaco',
				diagnostico: ''
			},
			fecha_in: '12/03/2020',
			fecha_out: null,
			fecha_prev_out: '12/04/2020'

		},

		{
			camaId: '2.3',
			tipo: 'ti',
			estado: 'ocupada',
			paciente: {
				dni: '22334455',
				name: 'Natalia Natalia',
				diagnostico: ''
			},
			fecha_in: '02/04/2020',
			fecha_out: null,
			fecha_prev_out: '12/04/2020'

		},
		{
			camaId: '2.4',
			tipo: 'ti',
			estado: 'ocupada',
			paciente: {
				dni: '33445566',
				name: 'Juan Pérez',
				diagnostico: ''
			},
			fecha_in: '03/04/2020',
			fecha_out: null,
			fecha_prev_out: '15/04/2020'

		},
		{
			camaId: '3.1',
			tipo: 'ti',
			estado: 'ocupada',
			paciente: {
				dni: '44556677',
				name: 'Ricardo Ricardo',
				diagnostico: ''
			},
			fecha_in: '04/04/2020',
			fecha_out: null,
			fecha_prev_out: '21/04/2020'

		},
	]

	
},

{

	name: 'Dream Theater',
	camas: {
		uti: 10, //unidad de terapia intensiva
		ti: 15,  // terapia intermedia
		conext: 16,
		internacion: 10
	},

	admisionServicios: [
		{
			nombre: 'Terapia intensiva',
			derivados: 0
		},
		{
			nombre: 'Terapia intermedia',
			derivados: 1
		},
		{
			nombre: 'Internación simple',
			derivados: 4
		},
		{
			nombre: 'Aislamiento',
			derivados: 3
		},
		{
			nombre: 'Guardia',
			derivados: 7
		},
	],

	servicios: [
		{
			id: '',
			nombre: 'Terapia intensiva',
			disponibilidadActual: 12,
			disponibilidadTotal: 20
		},
		{
			id: '',
			nombre: 'Terapia intermedia',
			disponibilidadActual: 20,
			disponibilidadTotal: 32
		},
		{
			id: '',
			nombre: 'Internación simple',
			disponibilidadActual: 30,
			disponibilidadTotal: 72
		},
		{
			id: '',
			nombre: 'Aislamiento',
			disponibilidadActual: 15,
			disponibilidadTotal: 28
		},
		{
			id: '',
			nombre: 'Guardia',
			disponibilidadActual: 5,
			disponibilidadTotal: 14
		},
	],

	estado_ocupacion: [
		{
			camaId: '1.1',
			lugar: 'hab-1',
			piso: '1',
			tipo: 'uti',
			estado: 'ocupada',
			paciente: {
				dni: '11222333',
				name: 'jorge lopez',
				diagnostico: ''
			},
			fecha_in: '12/03/2020',
			fecha_out: null,
			fecha_prev_out: '12/04/2020'

		},
		{
			camaId: '2.1',
			tipo: 'uti',
			estado: 'LIBRE',
			paciente: {
				dni: '11222333',
				name: 'margarita sánchez',
				diagnostico: ''
			},
			fecha_in: '25/03/2020',
			fecha_out: null,
			fecha_prev_out: '31/03/2020'

		},
		{
			camaId: '1.2',
			tipo: 'uti',
			estado: 'ocupada',
			paciente: {
				dni: '11222333',
				name: 'estela soldi',
				diagnostico: ''
			},
			fecha_in: '30/03/2020',
			fecha_out: null,
			fecha_prev_out: '12/06/2020'

		},
		{
			camaId: '1.1',
			tipo: 'uti',
			estado: 'ocupada',
			paciente: {
				dni: '11222333',
				name: 'jorgelina Alfieri',
				diagnostico: ''
			},
			fecha_in: '15/03/2020',
			fecha_out: null,
			fecha_prev_out: '12/05/2020'

		},
		{
			camaId: '2.2',
			tipo: 'uti',
			estado: 'ocupada',
			paciente: {
				dni: '11222333',
				name: 'pico  monaco',
				diagnostico: ''
			},
			fecha_in: '12/03/2020',
			fecha_out: null,
			fecha_prev_out: '12/04/2020'

		},

		{
			camaId: '2.3',
			tipo: 'ti',
			estado: 'ocupada',
			paciente: {
				dni: '22334455',
				name: 'Natalia Natalia',
				diagnostico: ''
			},
			fecha_in: '02/04/2020',
			fecha_out: null,
			fecha_prev_out: '12/04/2020'

		},
		{
			camaId: '2.4',
			tipo: 'ti',
			estado: 'ocupada',
			paciente: {
				dni: '33445566',
				name: 'Juan Pérez',
				diagnostico: ''
			},
			fecha_in: '03/04/2020',
			fecha_out: null,
			fecha_prev_out: '15/04/2020'

		},
		{
			camaId: '3.1',
			tipo: 'ti',
			estado: 'ocupada',
			paciente: {
				dni: '44556677',
				name: 'Ricardo Ricardo',
				diagnostico: ''
			},
			fecha_in: '04/04/2020',
			fecha_out: null,
			fecha_prev_out: '21/04/2020'

		},
	]

	
},
{

	name: 'Centro de salud XYZ',
	camas: {
		uti: 10, //unidad de terapia intensiva
		ti: 15,  // terapia intermedia
		conext: 16,
		internacion: 10
	},

	admisionServicios: [
		{
			nombre: 'Terapia intensiva',
			derivados: 0
		},
		{
			nombre: 'Terapia intermedia',
			derivados: 1
		},
		{
			nombre: 'Internación simple',
			derivados: 4
		},
		{
			nombre: 'Aislamiento',
			derivados: 3
		},
		{
			nombre: 'Guardia',
			derivados: 7
		},
	],

	servicios: [
		{
			id: '',
			nombre: 'Terapia intensiva',
			disponibilidadActual: 12,
			disponibilidadTotal: 20
		},
		{
			id: '',
			nombre: 'Terapia intermedia',
			disponibilidadActual: 20,
			disponibilidadTotal: 32
		},
		{
			id: '',
			nombre: 'Internación simple',
			disponibilidadActual: 30,
			disponibilidadTotal: 72
		},
		{
			id: '',
			nombre: 'Aislamiento',
			disponibilidadActual: 15,
			disponibilidadTotal: 28
		},
		{
			id: '',
			nombre: 'Guardia',
			disponibilidadActual: 5,
			disponibilidadTotal: 14
		},
	],

	estado_ocupacion: [
		{
			camaId: '1.1',
			lugar: 'hab-1',
			piso: '1',
			tipo: 'uti',
			estado: 'ocupada',
			paciente: {
				dni: '11222333',
				name: 'jorge lopez',
				diagnostico: ''
			},
			fecha_in: '12/03/2020',
			fecha_out: null,
			fecha_prev_out: '12/04/2020'

		},
		{
			camaId: '2.1',
			tipo: 'uti',
			estado: 'LIBRE',
			paciente: {
				dni: '11222333',
				name: 'margarita sánchez',
				diagnostico: ''
			},
			fecha_in: '25/03/2020',
			fecha_out: null,
			fecha_prev_out: '31/03/2020'

		},
		{
			camaId: '1.2',
			tipo: 'uti',
			estado: 'ocupada',
			paciente: {
				dni: '11222333',
				name: 'estela soldi',
				diagnostico: ''
			},
			fecha_in: '30/03/2020',
			fecha_out: null,
			fecha_prev_out: '12/06/2020'

		},
		{
			camaId: '1.1',
			tipo: 'uti',
			estado: 'ocupada',
			paciente: {
				dni: '11222333',
				name: 'jorgelina Alfieri',
				diagnostico: ''
			},
			fecha_in: '15/03/2020',
			fecha_out: null,
			fecha_prev_out: '12/05/2020'

		},
		{
			camaId: '2.2',
			tipo: 'uti',
			estado: 'ocupada',
			paciente: {
				dni: '11222333',
				name: 'pico  monaco',
				diagnostico: ''
			},
			fecha_in: '12/03/2020',
			fecha_out: null,
			fecha_prev_out: '12/04/2020'

		},

		{
			camaId: '2.3',
			tipo: 'ti',
			estado: 'ocupada',
			paciente: {
				dni: '22334455',
				name: 'Natalia Natalia',
				diagnostico: ''
			},
			fecha_in: '02/04/2020',
			fecha_out: null,
			fecha_prev_out: '12/04/2020'

		},
		{
			camaId: '2.4',
			tipo: 'ti',
			estado: 'ocupada',
			paciente: {
				dni: '33445566',
				name: 'Juan Pérez',
				diagnostico: ''
			},
			fecha_in: '03/04/2020',
			fecha_out: null,
			fecha_prev_out: '15/04/2020'

		},
		{
			camaId: '3.1',
			tipo: 'ti',
			estado: 'ocupada',
			paciente: {
				dni: '44556677',
				name: 'Ricardo Ricardo',
				diagnostico: ''
			},
			fecha_in: '04/04/2020',
			fecha_out: null,
			fecha_prev_out: '21/04/2020'

		},
	]

	
},
{

	name: 'Nosocomio bien equipado',
	camas: {
		uti: 10, //unidad de terapia intensiva
		ti: 15,  // terapia intermedia
		conext: 16,
		internacion: 10
	},

	admisionServicios: [
		{
			nombre: 'Terapia intensiva',
			derivados: 0
		},
		{
			nombre: 'Terapia intermedia',
			derivados: 1
		},
		{
			nombre: 'Internación simple',
			derivados: 4
		},
		{
			nombre: 'Aislamiento',
			derivados: 3
		},
		{
			nombre: 'Guardia',
			derivados: 7
		},
	],

	servicios: [
		{
			id: '',
			nombre: 'Terapia intensiva',
			disponibilidadActual: 12,
			disponibilidadTotal: 20
		},
		{
			id: '',
			nombre: 'Terapia intermedia',
			disponibilidadActual: 20,
			disponibilidadTotal: 32
		},
		{
			id: '',
			nombre: 'Internación simple',
			disponibilidadActual: 30,
			disponibilidadTotal: 72
		},
		{
			id: '',
			nombre: 'Aislamiento',
			disponibilidadActual: 15,
			disponibilidadTotal: 28
		},
		{
			id: '',
			nombre: 'Guardia',
			disponibilidadActual: 5,
			disponibilidadTotal: 14
		},
	],

	estado_ocupacion: [
		{
			camaId: '1.1',
			lugar: 'hab-1',
			piso: '1',
			tipo: 'uti',
			estado: 'ocupada',
			paciente: {
				dni: '11222333',
				name: 'jorge lopez',
				diagnostico: ''
			},
			fecha_in: '12/03/2020',
			fecha_out: null,
			fecha_prev_out: '12/04/2020'

		},
		{
			camaId: '2.1',
			tipo: 'uti',
			estado: 'LIBRE',
			paciente: {
				dni: '11222333',
				name: 'margarita sánchez',
				diagnostico: ''
			},
			fecha_in: '25/03/2020',
			fecha_out: null,
			fecha_prev_out: '31/03/2020'

		},
		{
			camaId: '1.2',
			tipo: 'uti',
			estado: 'ocupada',
			paciente: {
				dni: '11222333',
				name: 'estela soldi',
				diagnostico: ''
			},
			fecha_in: '30/03/2020',
			fecha_out: null,
			fecha_prev_out: '12/06/2020'

		},
		{
			camaId: '1.1',
			tipo: 'uti',
			estado: 'ocupada',
			paciente: {
				dni: '11222333',
				name: 'jorgelina Alfieri',
				diagnostico: ''
			},
			fecha_in: '15/03/2020',
			fecha_out: null,
			fecha_prev_out: '12/05/2020'

		},
		{
			camaId: '2.2',
			tipo: 'uti',
			estado: 'ocupada',
			paciente: {
				dni: '11222333',
				name: 'pico  monaco',
				diagnostico: ''
			},
			fecha_in: '12/03/2020',
			fecha_out: null,
			fecha_prev_out: '12/04/2020'

		},

		{
			camaId: '2.3',
			tipo: 'ti',
			estado: 'ocupada',
			paciente: {
				dni: '22334455',
				name: 'Natalia Natalia',
				diagnostico: ''
			},
			fecha_in: '02/04/2020',
			fecha_out: null,
			fecha_prev_out: '12/04/2020'

		},
		{
			camaId: '2.4',
			tipo: 'ti',
			estado: 'ocupada',
			paciente: {
				dni: '33445566',
				name: 'Juan Pérez',
				diagnostico: ''
			},
			fecha_in: '03/04/2020',
			fecha_out: null,
			fecha_prev_out: '15/04/2020'

		},
		{
			camaId: '3.1',
			tipo: 'ti',
			estado: 'ocupada',
			paciente: {
				dni: '44556677',
				name: 'Ricardo Ricardo',
				diagnostico: ''
			},
			fecha_in: '04/04/2020',
			fecha_out: null,
			fecha_prev_out: '21/04/2020'

		},
	]

	
}
];