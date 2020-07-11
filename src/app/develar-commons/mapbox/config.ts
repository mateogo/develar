export const STYLES = {
    STREETS:   'streets-v11',
    LIGHT:     'light-v10',
    DARK:      'dark-v10',
    OUTDOORS:  'outdoors-v11',
    SATELLITE: 'satellite-v9'
}

export const MARKER_COLORS = [
    { tipo: 'COVID',      color: '#C23838' },
    { tipo: 'DE ALTA',    color: '#83C84C' },
    { tipo: 'DESCARTADO', color: '#385CC2' },
    { tipo: 'SOSPECHA',   color: '#E5E535' },
    { tipo: 'EN MONITOREO',   color: '#D5D535' },
    { tipo: 'FALLECIDO',  color: '#0E0E0E' }
]

// export const MARKER_COLORS_OLD = [
//     { tipo: 'Positivo',          color: '#C23838' },
//     { tipo: 'Negativo',          color: '#83C84C' },
//     { tipo: 'Descartado',        color: '#385CC2' },
//     { tipo: 'En seguimiento',    color: '#E5E535' },
//     { tipo: 'Análisis en curso', color: '#E5E535' }
// ]
//lat  -34.8546979
//lng  -58.3834626

export const HEATMAP_PAINT = {
    'heatmap-weight': [
        'interpolate',
        ['linear'],
        ['get', 'lon'],
        0,
        0,
        6,
        1
    ],
    'heatmap-intensity': [
        'interpolate',
        ['linear'],
        ['zoom'],
        0,
        1,
        9,
        3
    ],
    'heatmap-color': [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0,
        'rgba(33,102,172,0)',
        0.2,
        'rgb(103,169,207)',
        0.4,
        'rgb(209,229,240)',
        0.6,
        'rgb(253,219,199)',
        0.8,
        'rgb(239,138,98)',
        1,
        'rgb(178,24,43)'
    ],

    'heatmap-radius': [
        'interpolate',
        ['linear'],
        ['zoom'],
        0,
        2,
        9,
        20
    ]
}