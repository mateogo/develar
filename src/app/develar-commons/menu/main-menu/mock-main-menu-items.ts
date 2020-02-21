import { MainMenuItem } from './main-menu-item';

export const MAINMENUITEMS: MainMenuItem[] = [
  {
    title: 'Main*',
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
    title: 'Dashboards',
    icon: 'fa fa-home',
    active: false,
    groupTitle: false,
    sub: [
      {
        title: 'Dashboard 1',
        routing: '/develar/a2/dashboard'
      },
      {
        title: 'Dashboard 2',
        routing: '/develar/a2/dashboard-2'
      }
    ],
    routing: '/develar/a2/dashboard',
    externalLink: '',
    budge: '2',
    budgeColor: '#f44236'
  },
  {
    title: 'Widgets',
    icon: 'fa fa-th',
    active: false,
    groupTitle : false,
    sub: '',
    routing: '/develar/a2/widgets',
    externalLink: '',
    budge: '',
    budgeColor: ''
  },
  {
    title: 'Calendar',
    icon: 'fas fa-calendar-alt',
    active: false,
    groupTitle : false,
    sub: '',
    routing: '/develar/a2/calendar',
    externalLink: '',
    budge: 'New',
    budgeColor: '#008000'
  },
  {
    title: 'Librería',
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
    title: 'Fichas',
    icon: 'fa fa-user-circle',
    active: false,
    groupTitle: false,
    sub: [
      {
        title: 'Dashboard',
        routing: '/develar/fichas'
      },
      {
        title: 'Navegar lista',
        routing: '/develar/fichas/lista'
      },
      {
        title: 'Navegar grid',
        routing: '/develar/fichas/grid'
      },
      {
        title: 'Alta nueva ficha',
        routing: '/develar/fichas/alta'
      },
      {
        title: 'Proyectos',
        routing: '/develar/proyectos'
      },
    ],
    routing: '',
    externalLink: '',
    budge: '',
    budgeColor: ''
  },

  {
    title: 'Desarrollo Social',
    icon: 'fa fa-user-circle',
    active: false,
    groupTitle: false,
    sub: [
      {
        title: 'Recepción',
        routing: '/dsocial/gestion/recepcion'
      },
      {
        title: 'Turnos DS',
        routing: '/dsocial/gestion/ayudadirecta'
      },
      {
        title: 'Atención TS',
        routing: '/dsocial/gestion/atencionsocial'
      },
      {
        title: 'Auditoría red familiar',
        routing: '/dsocial/gestion/validacionentregas'
      },
      {
        title: 'Seguimiento',
        routing: '/dsocial/gestion/seguimiento'
      },
      {
        title: 'Voucher de entrega',
        routing: '/dsocial/gestion/alimentos'
      },
      {
        title: 'Galpón',
        routing: '/dsocial/gestion/almacen'
      },
      {
        title: 'Navegar solicitudes',
        routing: '/dsocial/gestion/solicitudes'
      },
      {
        title: 'Tablero solicitudes',
        routing: '/dsocial/gestion/tableroasistencias'
      },
      {
        title: 'Tablero remitos',
        routing: '/dsocial/gestion/tableroremitos'
      },
      {
        title: 'Exportar Movimientos Almacén',
        routing: '/dsocial/gestion/exportaralmacen'
      },
    ],
    routing: '',
    externalLink: '',
    budge: '',
    budgeColor: ''
  },

  {
    title: 'Comunidades',
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
    title: 'Comunidades',
    icon: 'fa fa-user-circle',
    active: false,
    groupTitle: false,
    sub: [
      {
        title: 'gestionar comunidades',
        routing: '/develar/comunidades'
      },
      {
        title: 'vista pública',
        routing: '/patria'
      },
    ],
    routing: '',
    externalLink: '',
    budge: '',
    budgeColor: ''
  },
  {
    title: 'Notificaciones',
    icon: 'fa fa-user-circle',
    active: false,
    groupTitle: false,
    sub: [
      {
        title: 'nueva notificación',
        routing: '/develar/notificaciones/alta'
      },
      {
        title: 'navegar',
        routing: '/develar/notificaciones/navegar'
      },
      {
        title: 'chat',
        routing: '/develar/notificaciones/socket'
      },
    ],
    routing: '',
    externalLink: '',
    budge: '',
    budgeColor: ''
  },
  {
    title: 'Nocturnidad',
    icon: 'fa fa-user-circle',
    active: false,
    groupTitle: false,
    sub: [
      {
        title: 'Rol Nocturnidad',
        routing: '/rol/nocturnidad/panel'
      },
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
    title: 'Usuarios',
    icon: 'fa fa-user-circle',
    active: false,
    groupTitle: false,
    sub: [
      {
        title: 'Registrar usuario',
        routing: '/ingresar/registrarse'
      },
      {
        title: 'Olvidaste la clave?',
        routing: '/ingresar/nuevaclave'
      },
      {
        title: 'Confirmar correo',
        routing: '/ingresar/confirmar'
      },
      {
        title: 'Navegar',
        routing: '/develar/entidades/usuarios'
      },
    ],
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
        title: 'Alta nueva Persona',
        routing: '/develar/entidades/personas/alta'
      },
      {
        title: 'Persona - Usuario',
        routing: '/develar/entidades/personas/gestion'
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
        title: 'Kits Productos',
        routing: '/develar/entidades/productos/kits'
      },
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
      {
        title: 'Seriales de producto',
        routing: '/develar/entidades/productos/seriales'
      },
    ],
    routing: '',
    externalLink: '',
    budge: '',
    budgeColor: ''
  },

  {
    title: 'UI Elements',
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
    title: 'Material components',
    icon: 'fa fa-briefcase',
    active: false,
    groupTitle: false,
    sub: [
      {
        title: 'Button',
        routing: '/develar/a2/button'
      },
      {
        title: 'Card',
        routing: '/develar/a2/card'
      },
      {
        title: 'Checkbox',
        routing: '/develar/a2/checkbox'
      },
      {
        title: 'Chips',
        routing: '/develar/a2/chips'
      },
      {
        title: 'Dialog',
        routing: '/develar/a2/dialog'
      },
      {
        title: 'Icon',
        routing: '/develar/a2/icon'
      },
      {
        title: 'Input',
        routing: '/develar/a2/input'
      },
      {
        title: 'List',
        routing: '/develar/a2/list'
      },
      {
        title: 'Menu',
        routing: '/develar/a2/menu'
      },
      {
        title: 'Progress bar',
        routing: '/develar/a2/progress-bar'
      },
      {
        title: 'Progress spinner',
        routing: '/develar/a2/progress-spinner'
      },
      {
        title: 'Radio Button',
        routing: '/develar/a2/radio-button'
      },
      {
        title: 'Select',
        routing: '/develar/a2/select'
      },
      {
        title: 'Slider',
        routing: '/develar/a2/slider'
      },
      {
        title: 'Slide toggle',
        routing: '/develar/a2/slide-toggle'
      },
      {
        title: 'Snackbar',
        routing: '/develar/a2/snackbar'
      },
      {
        title: 'Tabs',
        routing: '/develar/a2/tabs'
      },
      {
        title: 'Toolbar',
        routing: '/develar/a2/toolbar'
      },
      {
        title: 'Tooltip',
        routing: '/develar/a2/tooltip'
      }
    ],
    routing: '',
    externalLink: '',
    budge: '',
    budgeColor: ''
  },
  {
    title: 'A2 components',
    icon: 'far fa-diamond',
    active: false,
    groupTitle: false,
    sub: [
      {
        title: 'Alert',
        routing: '/develar/a2/alert'
      },
      {
        title: 'Badge',
        routing: '/develar/a2/badge'
      },
      {
        title: 'Breadcrumb',
        routing: '/develar/a2/breadcrumb'
      },
      {
        title: 'Card',
        routing: '/develar/a2/a2-card'
      },
      {
        title: 'File',
        routing: '/develar/a2/file'
      }
    ],
    routing: '',
    externalLink: '',
    budge: '',
    budgeColor: ''
  },
  {
    title: 'Typography',
    icon: 'fa fa-font',
    active: false,
    groupTitle : false,
    sub: '',
    routing: '/develar/a2/typography',
    externalLink: '',
    budge: '',
    budgeColor: ''
  },
  {
    title: 'Tables',
    icon: 'fa fa-table',
    active: false,
    groupTitle: false,
    sub: [
      {
        title: 'Simple table',
        routing: '/develar/a2/simple-table'
      },
      {
        title: 'Editing table',
        routing: '/develar/a2/editing-table'
      },
      {
        title: 'Filtering table',
        routing: '/develar/a2/filtering-table'
      },
      {
        title: 'Pagination table',
        routing: '/develar/a2/pagination-table'
      },
      {
        title: 'Bootstrap tables',
        routing: '/develar/a2/bootstrap-tables'
      },
    ],
    routing: '',
    externalLink: '',
    budge: '',
    budgeColor: ''
  },
  {
    title: 'Forms',
    icon: 'far fa-check-square',
    active: false,
    groupTitle: false,
    sub: [
      {
        title: 'Form Elements',
        routing: '/develar/a2/form-elements'
      },
      {
        title: 'Form Layout',
        routing: '/develar/a2/form-layout'
      },
      {
        title: 'Form Validation',
        routing: '/develar/a2/form-validation'
      },
    ],
    routing: '',
    externalLink: '',
    budge: '',
    budgeColor: ''
  },
  {
    title: 'Charts',
    icon: 'fa fa-pie-chart',
    active: false,
    groupTitle: false,
    sub: [
      {
        title: 'Line Chart',
        routing: '/develar/a2/line-chart'
      },
      {
        title: 'Bar Chart',
        routing: '/develar/a2/bar-chart'
      },
      {
        title: 'Doughnut Chart',
        routing: '/develar/a2/doughnut-chart'
      },
      {
        title: 'Radar Chart',
        routing: '/develar/a2/radar-chart'
      },
      {
        title: 'Pie Chart',
        routing: '/develar/a2/pie-chart'
      },
      {
        title: 'Polar Area Chart',
        routing: '/develar/a2/polar-area-chart'
      },
      {
        title: 'Dynamic Chart',
        routing: '/develar/a2/dynamic-chart'
      }
    ],
    routing: '',
    externalLink: '',
    budge: '',
    budgeColor: ''
  },
  {
    title: 'Maps',
    icon: 'fa fa-map-marker',
    active: false,
    groupTitle: false,
    sub: [
      {
        title: 'Google map',
        routing: '/develar/a2/google-map'
      },
      {
        title: 'Leaflet map',
        routing: '/develar/a2/leaflet-map'
      }
    ],
    routing: '',
    externalLink: '',
    budge: '',
    budgeColor: ''
  },
  {
    title: 'Pages',
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
    title: 'Pages service',
    icon: 'fa fa-edit',
    active: false,
    groupTitle: false,
    sub: [
      {
        title: 'About Us',
        routing: '/develar/a2/about-us'
      },
      {
        title: 'FAQ',
        routing: '/develar/a2/faq'
      },
      {
        title: 'TimeLine',
        routing: '/develar/a2/timeline'
      },
      {
        title: 'Invoice',
        routing: '/develar/a2/invoice'
      },
    ],
    routing: '',
    externalLink: '',
    budge: 'New',
    budgeColor: '#008000'
  },
  {
    title: 'Extra pages',
    icon: 'fa fa-clone',
    active: false,
    groupTitle: false,
    sub: [
      {
        title: '404',
        routing: '/develar/a2/extra-layout/page-404'
      },
      {
        title: '500',
        routing: '/develar/a2/extra-layout/page-500'
      },
      {
        title: 'Not found',
        routing: '/develar/a2/not-found'
      }
    ],
    routing: '',
    externalLink: '',
    budge: '',
    budgeColor: ''
  }
];

export const DSOCIAL_ITEMS: MainMenuItem[] = [
  {
    title: 'Desarrollo Social',
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
    title: 'Desarrollo Social',
    icon: 'fa fa-user-circle',
    active: false,
    groupTitle: false,
    sub: [
      {
        title: 'Recepción',
        routing: '/dsocial/gestion/recepcion'
      },
      {
        title: 'Turnos DS',
        routing: '/dsocial/gestion/ayudadirecta'
      },
      {
        title: 'Atención TS',
        routing: '/dsocial/gestion/atencionsocial'
      },
      {
        title: 'Auditoría red familiar',
        routing: '/dsocial/gestion/validacionentregas'
      },
      {
        title: 'Seguimiento',
        routing: '/dsocial/gestion/seguimiento'
      },
      {
        title: 'Voucher de entrega',
        routing: '/dsocial/gestion/alimentos'
      },
      {
        title: 'Galpón',
        routing: '/dsocial/gestion/almacen'
      },
      {
        title: 'Navegar solicitudes',
        routing: '/dsocial/gestion/solicitudes'
      },
      {
        title: 'Tablero solicitudes',
        routing: '/dsocial/gestion/tableroasistencias'
      },
      {
        title: 'Tablero remitos',
        routing: '/dsocial/gestion/tableroremitos'
      },
      {
        title: 'Exportar Movimientos Almacén',
        routing: '/dsocial/gestion/exportaralmacen'
      },
    ],
    routing: '',
    externalLink: '',
    budge: '',
    budgeColor: ''
  },

  {
    title: 'Comunidades',
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
    title: 'Fichas',
    icon: 'fa fa-user-circle',
    active: false,
    groupTitle: false,
    sub: [
      {
        title: 'Dashboard',
        routing: '/develar/fichas'
      },
      {
        title: 'Navegar lista',
        routing: '/develar/fichas/lista'
      },
      {
        title: 'Navegar grid',
        routing: '/develar/fichas/grid'
      },
      {
        title: 'Alta nueva ficha',
        routing: '/develar/fichas/alta'
      },
      {
        title: 'Proyectos',
        routing: '/develar/proyectos'
      },
    ],
    routing: '',
    externalLink: '',
    budge: '',
    budgeColor: ''
  },

  {
    title: 'Comunidades',
    icon: 'fa fa-user-circle',
    active: false,
    groupTitle: false,
    sub: [
      {
        title: 'gestionar comunidades',
        routing: '/develar/comunidades'
      },
      {
        title: 'vista pública',
        routing: '/patria'
      },
    ],
    routing: '',
    externalLink: '',
    budge: '',
    budgeColor: ''
  },
  {
    title: 'Notificaciones',
    icon: 'fa fa-user-circle',
    active: false,
    groupTitle: false,
    sub: [
      {
        title: 'nueva notificación',
        routing: '/develar/notificaciones/alta'
      },
      {
        title: 'navegar',
        routing: '/develar/notificaciones/navegar'
      },
      {
        title: 'chat',
        routing: '/develar/notificaciones/socket'
      },
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
    title: 'Usuarios',
    icon: 'fa fa-user-circle',
    active: false,
    groupTitle: false,
    sub: [
      {
        title: 'Registrar usuario',
        routing: '/ingresar/registrarse'
      },
      {
        title: 'Olvidaste la clave?',
        routing: '/ingresar/nuevaclave'
      },
      {
        title: 'Confirmar correo',
        routing: '/ingresar/confirmar'
      },
      {
        title: 'Navegar',
        routing: '/develar/entidades/usuarios'
      },
    ],
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
        title: 'Persona - Usuario',
        routing: '/develar/entidades/personas/gestion'
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
        title: 'Kits Productos',
        routing: '/develar/entidades/productos/kits'
      },
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
      {
        title: 'Seriales de producto',
        routing: '/develar/entidades/productos/seriales'
      },
    ],
    routing: '',
    externalLink: '',
    budge: '',
    budgeColor: ''
  }

];

export const CCK_ITEMS: MainMenuItem[] = [
  {
    title: 'SISPLAN',
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
    title: 'Planificación CCK',
    icon: 'fa fa-user-circle',
    active: false,
    groupTitle: false,
    sub: [
      {
        title: 'Nuevo Proyecto',
        routing: '/cck/gestion/proyectos/nuevo'
      },
      {
        title: 'Navegar Proyectos',
        routing: '/cck/gestion/proyectos/navegar'
      },
      {
        title: 'Nuevo Presupuesto',
        routing: '/cck/gestion/presupuesto/nuevo'
      },
      {
        title: 'Navegar Presupuesto',
        routing: '/cck/gestion/presupuesto/navegar'
      },
    ],
    routing: '',
    externalLink: '',
    budge: '',
    budgeColor: ''
  },

  {
    title: 'Comunidades',
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
    title: 'Fichas',
    icon: 'fa fa-user-circle',
    active: false,
    groupTitle: false,
    sub: [
      {
        title: 'Dashboard',
        routing: '/develar/fichas'
      },
      {
        title: 'Navegar lista',
        routing: '/develar/fichas/lista'
      },
      {
        title: 'Navegar grid',
        routing: '/develar/fichas/grid'
      },
      {
        title: 'Alta nueva ficha',
        routing: '/develar/fichas/alta'
      },
      {
        title: 'Proyectos',
        routing: '/develar/proyectos'
      },
    ],
    routing: '',
    externalLink: '',
    budge: '',
    budgeColor: ''
  },

  {
    title: 'Comunidades',
    icon: 'fa fa-user-circle',
    active: false,
    groupTitle: false,
    sub: [
      {
        title: 'gestionar comunidades',
        routing: '/develar/comunidades'
      },
      {
        title: 'vista pública',
        routing: '/patria'
      },
    ],
    routing: '',
    externalLink: '',
    budge: '',
    budgeColor: ''
  },
  {
    title: 'Notificaciones',
    icon: 'fa fa-user-circle',
    active: false,
    groupTitle: false,
    sub: [
      {
        title: 'nueva notificación',
        routing: '/develar/notificaciones/alta'
      },
      {
        title: 'navegar',
        routing: '/develar/notificaciones/navegar'
      },
      {
        title: 'chat',
        routing: '/develar/notificaciones/socket'
      },
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
    title: 'Usuarios',
    icon: 'fa fa-user-circle',
    active: false,
    groupTitle: false,
    sub: [
      {
        title: 'Registrar usuario',
        routing: '/ingresar/registrarse'
      },
      {
        title: 'Olvidaste la clave?',
        routing: '/ingresar/nuevaclave'
      },
      {
        title: 'Confirmar correo',
        routing: '/ingresar/confirmar'
      },
      {
        title: 'Navegar',
        routing: '/develar/entidades/usuarios'
      },
    ],
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
        title: 'Persona - Usuario',
        routing: '/develar/entidades/personas/gestion'
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
        title: 'Kits Productos',
        routing: '/develar/entidades/productos/kits'
      },
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
      {
        title: 'Seriales de producto',
        routing: '/develar/entidades/productos/seriales'
      },
    ],
    routing: '',
    externalLink: '',
    budge: '',
    budgeColor: ''
  }

];


export const COMERCIO_ITEMS: MainMenuItem[] = [

  {
    title: 'Comercios',
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
    title: 'Nocturnidad',
    icon: 'fa fa-user-circle',
    active: false,
    groupTitle: false,
    sub: [
      {
        title: 'Rol Nocturnidad',
        routing: '/rol/nocturnidad/panel'
      },
    ],
    routing: '',
    externalLink: '',
    budge: '',
    budgeColor: ''
  },
  {
    title: 'Comunidades',
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
    title: 'Fichas',
    icon: 'fa fa-user-circle',
    active: false,
    groupTitle: false,
    sub: [
      {
        title: 'Dashboard',
        routing: '/develar/fichas'
      },
      {
        title: 'Navegar lista',
        routing: '/develar/fichas/lista'
      },
      {
        title: 'Navegar grid',
        routing: '/develar/fichas/grid'
      },
      {
        title: 'Alta nueva ficha',
        routing: '/develar/fichas/alta'
      },
      {
        title: 'Proyectos',
        routing: '/develar/proyectos'
      },
    ],
    routing: '',
    externalLink: '',
    budge: '',
    budgeColor: ''
  },

  {
    title: 'Comunidades',
    icon: 'fa fa-user-circle',
    active: false,
    groupTitle: false,
    sub: [
      {
        title: 'gestionar comunidades',
        routing: '/develar/comunidades'
      },
      {
        title: 'vista pública',
        routing: '/patria'
      },
    ],
    routing: '',
    externalLink: '',
    budge: '',
    budgeColor: ''
  },
  {
    title: 'Notificaciones',
    icon: 'fa fa-user-circle',
    active: false,
    groupTitle: false,
    sub: [
      {
        title: 'nueva notificación',
        routing: '/develar/notificaciones/alta'
      },
      {
        title: 'navegar',
        routing: '/develar/notificaciones/navegar'
      },
      {
        title: 'chat',
        routing: '/develar/notificaciones/socket'
      },
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
    title: 'Usuarios',
    icon: 'fa fa-user-circle',
    active: false,
    groupTitle: false,
    sub: [
      {
        title: 'Registrar usuario',
        routing: '/ingresar/registrarse'
      },
      {
        title: 'Olvidaste la clave?',
        routing: '/ingresar/nuevaclave'
      },
      {
        title: 'Confirmar correo',
        routing: '/ingresar/confirmar'
      },
      {
        title: 'Navegar',
        routing: '/develar/entidades/usuarios'
      },
    ],
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
        title: 'Persona - Usuario',
        routing: '/develar/entidades/personas/gestion'
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
        title: 'Kits Productos',
        routing: '/develar/entidades/productos/kits'
      },
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
      {
        title: 'Seriales de producto',
        routing: '/develar/entidades/productos/seriales'
      },
    ],
    routing: '',
    externalLink: '',
    budge: '',
    budgeColor: ''
  }

];



export const COMPANY_MENU = {
  'DEFAULT': MAINMENUITEMS,
  dsocial:   DSOCIAL_ITEMS,
  cck:       CCK_ITEMS,
  comercios: COMERCIO_ITEMS

};

