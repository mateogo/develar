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
    title: 'La red',
    icon: 'fa fa-home',
    active: true,
    groupTitle: false,
    sub: [
      {
        title: 'Quiénes somos',
        routing: '/trabajan/info/acercade'
      },
      {
        title: 'Participá',
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
        title: 'Agrónoma',
        routing: '/trabajan/red'
      },
      {
        title: 'Antropóloga',
        routing: '/trabajan/red'
      },
      {
        title: 'Artesana',
        routing: '/trabajan/red'
      },
      {
        title: 'Bióloga',
        routing: '/trabajan/red'
      },
      {
        title: 'Bioquímica',
        routing: '/trabajan/red'
      },
      {
        title: 'Informática',
        routing: '/trabajan/red'
      },
      {
        title: 'Transportista',
        routing: '/trabajan/red'
      },
      {
        title: 'Música',
        routing: '/trabajan/red'
      },
      {
        title: 'Entrenadora',
        routing: '/trabajan/red'
      },
      {
        title: 'Obrera',
        routing: '/trabajan/red'
      },
      {
        title: 'Soldadora',
        routing: '/trabajan/red'
      },
    ],
    routing: '',
    externalLink: '',
    budge: '',
    budgeColor: ''
  },

  {
    title: 'Equipo',
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