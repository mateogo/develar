/*
 *  core utils.js
 *  package: /core/service/commons.utils
 *  Use:
 *     Exporta un objeto con funciones utilitarias
 */

const nodemailer = require('nodemailer');
const _ = require('underscore');

const whoami = 'sendmail:';

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        //user: 'intranet.mcn.2@gmail.com',
        user: 'intranet.develar@gmail.com',
        pass: 'd3v3l4r*+'
       }
});




const subject_default_tpl = _.template("[<%= prefix %>] <%= subject %>");
const body_default_tpl = _.template(
            "<br>"+
            "<div><%= body %></div>"+
            "<br>"+
            "<br>"+
            "<br>"+
            "<div>"+
            "<p>Si usted esta recibiendo este mail en forma indebida, por favor contáctese con el administrador</p>"+
            "<p>Buenos Aires - Argentina</p>"
        );


const mailTemplates = {
        default: {
            prefix: 'develar',
            subject: subject_default_tpl,
            body: body_default_tpl
        }
    };





//            "<p><a href='http://www.cultura.gob.ar'>Ministerio de Cultura</a></p>"

exports.sendMail = function (mailOptions, errorcb, cb){
    let tpl;

    if(mailOptions.template){
        tpl = mailTemplates[mailOptions.template]
        delete mailOptions.template;

    }else{
        tpl = mailTemplates['default']
    }

    if(mailOptions.prefix) {
        tpl.prefix = mailOptions.prefix;
        delete mailOptions.prefix;
    }


    mailOptions.subject = tpl.subject({prefix: tpl.prefix, subject:mailOptions.subject});
    mailOptions.html = tpl.body({body:mailOptions.body});

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if (error){
      
            if(errorcb){
                console.log("sendMail ERROR");
                let message = {
                    message: 'Message error: ' + error.response,
                };
                errorcb(message);

            }

            throw error;  

      } 

      if(info){
        if(cb){
            let message = {
                message: 'Message sent: ' + info.response,
            };
            cb(message);
        }        
      }

    });
};




class MailModel{

  constructor (options){
    this.mailData = {
        template: 'default',
        prefix: 'develar',
        from:  '',
        to:    '',
        cc:    '',
        subject:  '',
        body:  '',
    }
    if(options) Object.assign(this.mailData, options);
  }

  set bodyTemplate(tmpl){
    this.mailData.template = tmpl;
  }

  get bodyTemplate(){
    return this.mailData.template;
  }

  set subjectPrefix(txt){
    this.mailData.prefix = txt;
  }

  get subjectPrefix(){
    return this.mailData.prefix;
  }

  set mailFrom(data){
    this.mailData.from = data;
  }

  set mailTo(data){
    this.mailData.to = data;
  }

  set mailSubject(data){
    this.mailData.subject = data;
  }

  set mailBody(data){
    this.mailData.body = data;
  }


  get content(){
    return this.mailData;
  }
  
}

exports.mailFactory = function (mailOptions){
    return new MailModel(mailOptions);
}



