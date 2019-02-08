import { MainMenuItem } from '../menu-helper';

export const LASARGEN: MainMenuItem[] = [
  {
    title: 'Las argentinas',
    icon: '',
    active: true,
    groupTitle : true,
    sub: '',
    routing: '',
    externalLink: '',
    budge: '',
    budgeColor: ''
  },
  {
    title: 'LA RED',
    icon: 'fa fa-home',
    active: true,
    groupTitle: false,
    sub: [
      {
        title: 'Quiénes somos',
        routing: '/trabajan/info/acercade'
      },
      {
        title: 'Sumate',
        routing: '/trabajan/info/contacto'
      }
    ],
    routing: '',
    externalLink: '',
    budge: '',
    budgeColor: ''
  },
  {
    title: 'ÁREAS',
    icon: 'fa fa-th',
    active: true,
    groupTitle: false,
    sub: [
      {
        title: 'Agronomía',
        routing: '/trabajan/red'
      },
      {
        title: 'Antropología',
        routing: '/trabajan/red'
      },
      {
        title: 'Artesanía',
        routing: '/trabajan/red'
      },
      {
        title: 'Biología',
        routing: '/trabajan/red'
      },
      {
        title: 'Bioquímica',
        routing: '/trabajan/red'
      },
      {
        title: 'Construcción',
        routing: '/trabajan/red'
      },
      {
        title: 'Deporte',
        routing: '/trabajan/red'
      },
      {
        title: 'Economía',
        routing: '/trabajan/red'
      },
      {
        title: 'Industria',
        routing: '/trabajan/red'
      },
      {
        title: 'Informática',
        routing: '/trabajan/red'
      },
      {
        title: 'Música',
        routing: '/trabajan/red'
      },
      {
        title: 'Transporte',
        routing: '/trabajan/red'
      },
    ],
    routing: '',
    externalLink: '',
    budge: '',
    budgeColor: ''
  },

  {
    title: 'EQUIPO',
    icon: 'fa fa-user-circle',
    active: false,
    groupTitle: false,
    sub: [
      {
        title: 'Ingresar',
        routing: '/develar/antecedentes'
      },
    ],
    routing: '',
    externalLink: '',
    budge: '',
    budgeColor: ''
  },


];