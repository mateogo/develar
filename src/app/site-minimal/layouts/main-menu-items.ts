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
        title: 'Infraestructura y logística',
        routing: '/trabajan/red'
      },
      {
        title: 'Defensa y Seguridad',
        routing: '/trabajan/red'
      },
      {
        title: 'Salud y Ciencia',
        routing: '/trabajan/red'
      },
      {
        title: 'Derechos humanos y Justicia',
        routing: '/trabajan/red'
      },
      {
        title: 'Educación, cultura y deportes',
        routing: '/trabajan/red'
      },
      {
        title: 'Economía y Administración',
        routing: '/trabajan/red'
      },
      {
        title: 'Comercio y servicios',
        routing: '/trabajan/red'
      },
      {
        title: 'Industria y Agricultura',
        routing: '/trabajan/red'
      },
      {
        title: 'Ecología y Medio ambiente',
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