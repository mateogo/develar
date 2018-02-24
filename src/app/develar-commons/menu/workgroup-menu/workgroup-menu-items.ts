import { WorkgroupMenuItem } from './workgroup-menu-item';

export const WORKGROUPITEMS: WorkgroupMenuItem[] = [
  {
    title: 'Main',
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
    title: 'Workgroup',
    icon: '',
    active: false,
    groupTitle : true,
    sub: '',
    routing: '',
    externalLink: '',
    budge: '',
    budgeColor: ''
  },

  {
    title: 'Proyectos',
    icon: 'fa fa-user-circle',
    active: false,
    groupTitle: false,
    sub: [
      {
        title: 'Dashboard',
        routing: '/develar/proyectos'
      },
      {
        title: 'Navegar fichas - L',
        routing: '/develar/proyectos/lista'
      },
      {
        title: 'Navegar fichas - G',
        routing: '/develar/proyectos/grid'
      },
      {
        title: 'Alta nueva ficha',
        routing: '/develar/proyectos/alta'
      }
    ],
    routing: '',
    externalLink: '',
    budge: '',
    budgeColor: ''
  },
  {
    title: 'Entidades',
    icon: '',
    active: false,
    groupTitle : true,
    sub: '',
    routing: '',
    externalLink: '',
    budge: '',
    budgeColor: ''
  },

  {
    title: 'Personas',
    icon: 'fa fa-user-circle',
    active: false,
    groupTitle: false,
    sub: [
      {
        title: 'Navegar Personas',
        routing: '/develar/entidades/personas'
      },
      {
        title: 'Alta nueva persona',
        routing: '/develar/entidades/personas/alta'
      },
      {
        title: 'Person map',
        routing: '/develar/entidades/personas/google-map'
      }      
    ],
    routing: '',
    externalLink: '',
    budge: '',
    budgeColor: ''
  },
  {
    title: 'Productos',
    icon: 'fa fa-user-circle',
    active: false,
    groupTitle: false,
    sub: [
      {
        title: 'Navegar Productos',
        routing: '/develar/entidades/productos'
      },
      {
        title: 'Alta producto',
        routing: '/develar/entidades/productos/alta'
      },
      {
        title: 'Items producto',
        routing: '/develar/entidades/productos/items'
      },
    ],
    routing: '',
    externalLink: '',
    budge: '',
    budgeColor: ''
  }

];