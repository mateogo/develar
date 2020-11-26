const express = require('express');
const path = require('path');
const config = require('./config/config');
const passportconf = require('./config/passportconf');

const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const routes = require(path.join(config.rootPath, 'core/routes/index'));
const pdfRoutes = require('./routes/zpdfRoutes.js');
const auditentregasRoutes = require('./routes/auditentregasRoutes.js');
const asistenciasRoutes = require('./routes/asistenciasRoutes.js');
const asisprevencionRoutes = require('./routes/asisprevencionRoutes.js');
const zauditDataRoutes = require('./routes/zauditDateRoutes.js');
const zcetecwsRoutes = require('./routes/zcetecwsRoutes.js');
const integracioncovidRoutes = require('./routes/integracioncovidRoutes.js');
const solinternacionRoutes = require('./routes/solinternacionRoutes.js');
const pculturalRoutes = require('./routes/pculturalRoutes.js');
const censoRoutes = require('./routes/censoRoutes.js');
const budgetRoutes = require('./routes/budgetRoutes.js');
const recordcardRoutes = require('./routes/recordcardRoutes.js');
const serialRoutes = require('./routes/serialRoutes.js');
const turnosRoutes = require('./routes/turnosRoutes.js');
const gturnosRoutes = require('./routes/gturnosRoutes.js');
const locacioneshospRoutes = require('./routes/locacionhospRoutes.js');
const gturnosasignadosRoutes = require('./routes/gturnosasignadosRoutes.js');
const tasksRoutes = require('./routes/tasksRoutes.js');
const observacionesRoutes = require('./routes/observacionesRoutes.js');
const rolnocturnidadRoutes = require('./routes/rolnocturnidadRoutes.js');
const remitosAlmacenRoutes = require('./routes/almacenRoutes.js');
const userRouter = require('./routes/userRouter.js');
const parserRoutes = require('./routes/parserRoutes.js');
const assetRoutes = require('./routes/assetRoutes.js');
const folderRoutes = require('./routes/folderRoutes.js');
const productRoutes = require('./routes/productRoutes.js');
const productKitRoutes = require('./routes/productKitRoutes.js');
const productitRoutes = require('./routes/productitRoutes.js');
const productsnRoutes = require('./routes/productsnRoutes.js');
const communityRoutes = require('./routes/communityRoutes.js');
const tagRoutes = require('./routes/tagRoutes.js');
const personRoutes = require('./routes/personRoutes.js');
const alimentarRoutes = require('./routes/alimentarRoutes.js');
const commonRouter = require('./routes/commonRouter.js');
const gcseRoutes = require('./routes/gcseRoutes');
const crawlRoutes = require('./routes/crawlerRoutes');
const uploadRoutes = require('./services/uploadfs');
const downloadRoutes = require('./routes/downloadRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const userWebRoutes = require('./routes/usuarioswebRoutes.js');

const app = express();

// analizar estas declaraciones. Qué son 'cors': Cross origin request
// app.use(function(req, res, next) { //allow cross origin requests
//   res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
//   res.header("Access-Control-Allow-Origin", "http://localhost:xxxx");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   res.header("Access-Control-Allow-Credentials", true);
//   next();
//   });
// view engine setup
app.set('views', path.join(config.rootPath, 'core/views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

app.use(
  helmet.frameguard({
    action: 'allow-from',
    domain: 'https://youtu.be'
  }));
//app.use(validateSession);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  keys: ['develar'],
  maxAge: 24 * 60 * 60 * 1000

}));
app.use(express.static(config.publicPath));
passportconf(app);

const myLogger = function (req, res, next) {
  console.log('++++++++My logger ++++++++++')
  next();
};

app.use(myLogger);
console.log('++++++++dynamic begins ++++++++++')
app.use('/pug', routes);
app.use('/api/parser', parserRoutes);
app.use('/api/gcse', gcseRoutes);
app.use('/api/crawl', crawlRoutes);
app.use('/api/remitosalmacen', remitosAlmacenRoutes);
app.use('/api/asistencias', asistenciasRoutes);
app.use('/api/asisprevencion', asisprevencionRoutes);
app.use('/api/integracioncovid', integracioncovidRoutes);
app.use('/api/solinternacion', solinternacionRoutes);
app.use('/api/censoindustrias', censoRoutes);
app.use('/api/usuariosweb', userWebRoutes);
app.use('/api/eventosculturales', pculturalRoutes);
app.use('/api/presupuestos', budgetRoutes);
app.use('/api/auditentregas', auditentregasRoutes);
app.use('/api/recordcards', recordcardRoutes);
app.use('/api/seriales', serialRoutes);
app.use('/api/turnos', turnosRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/auditodatos', zauditDataRoutes);
app.use('/api/cetec', zcetecwsRoutes);
app.use('/api/locacionhospitalaria', locacioneshospRoutes);
app.use('/api/turnosdisponibles', gturnosRoutes);
app.use('/api/turnosasignados', gturnosasignadosRoutes);
app.use('/api/observaciones', observacionesRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/rolnocturnidad', rolnocturnidadRoutes);
app.use('/api/persons', personRoutes);
app.use('/api/alimentar', alimentarRoutes);
app.use('/api/users', userRouter);
app.use('/api/assets', assetRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/productkits', productKitRoutes);
app.use('/api/productits', productitRoutes);
app.use('/api/productserial', productsnRoutes);
app.use('/api/communities', communityRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/utils', commonRouter);
app.use('/api/upload', uploadRoutes)
app.use('/download', downloadRoutes)

//===============ERROR RENDERING BEGIN ==================
// catch 404 and forward to error handler

app.use(function(req, res, next) {
  console.log('**************************Catchig 404');
  res.sendFile(path.join(config.publicPath,'index.html'))
  // const err = new Error('Not Found');
  // err.status = 404;
  // next(err);
});

// development error handler, will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler, no stacktraces leaked to user
app.use(function(err, req, res, next) {
  console.log('modo PRODUCTION')
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
//============= end error handling ========================


module.exports = app;
