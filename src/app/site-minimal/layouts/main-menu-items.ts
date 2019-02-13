import { MainMenuItem, SocialMediaItem } from '../menu-helper';

export const SOCIAL_MEDIA: SocialMediaItem[] = [
  {
    title: 'Seguinos en Twitter',
    icon: 'fab fa-twitter',
    url: 'https://twitter.com/LTrabajamos',
  },
  {
    title: 'Seguinos en Instagram',
    icon: 'fab fa-instagram',
    url: 'https://www.instagram.com/lasargentinastrabajamos/',
  },
  {
    title: 'Seguinos en Youtube',
    icon: 'fab fa-youtube',
    url: 'https://www.youtube.com/channel/UC3v929SgY4je4ZCrv8pgdFw',
  },
  {
    title: 'Seguinos en Facebook',
    icon: 'fab fa-facebook-f',
    url: 'https://www.facebook.com/Las-Argentinas-Trabajamos-823424687995613',
  },


 ];

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
        routing:'/trabajan/info/acercade'
      },
      {
        title: 'Sumate',
        routing:'/trabajan/info/contacto'
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
        routing: '/trabajan/red/5c5a9b991c317419f2cd8859'
      },
      {
        title: 'Antropología',
        routing: '/trabajan/red/5c5a90831c317419f2cd8616'
      },
      {
        title: 'Artesanía',
        routing: '/trabajan/red/5c5a96931c317419f2cd873b'
      },
      {
        title: 'Biología',
        routing: '/trabajan/red/5c5aa3e11c317419f2cd8a6f'
      },
      {
        title: 'Bioquímica',
        routing: '/trabajan/red/5c5a7bfe63ee3254df9502f1'
      },
      {
        title: 'Construcción',
        routing: '/trabajan/red/5c5aa0421c317419f2cd8971'
      },
      {
        title: 'Deporte',
        routing: '/trabajan/red/5c1adc90c1ba687e54a8e0a4'
      },
      {
        title: 'Economía',
        routing: '/trabajan/red/5c1adf4bc1ba687e54a8e13c'
      },
      {
        title: 'Industria',
        routing: '/trabajan/red/5c5a948f1c317419f2cd86da'
      },
      {
        title: 'Informática',
        routing: '/trabajan/red/5c5a9e071c317419f2cd88c3'
      },
      {
        title: 'Música',
        routing: '/trabajan/red/5c5a8d891c317419f2cd85cf'
      },
      {
        title: 'Transporte',
        routing: '/trabajan/red/5c5a92791c317419f2cd866a'
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
        routing: '/ingresar/login'
      },
    ],
    routing: '',
    externalLink: '',
    budge: '',
    budgeColor: ''
  },


];
//    cloud
//    5c5aa3e11c317419f2cd8a6f: bibiana
//     5c5a7bfe63ee3254df9502f1: bioquimica

//    local
//    5c602cc2ad8cd10781150896: bibiana
//     5c5a67974c4cca0988801bdb: bioquimica