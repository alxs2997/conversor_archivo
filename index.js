var express = require('express');
var isJson = require('is-json');
var expressFileupload = require('express-fileupload');
var convert = require('xml-js');

var json2xls = require('json2xls');
var bodyParser = require('body-parser');
var fs = require('fs');

const app = express();

app.use(expressFileupload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');

const PORT = 3000;

app.get('/', (req, res) => {
  res.render('index', { title: 'Json file free converter' });
});

app.post('/convertir', (req, res) => {
  // guardando y moviendo el archivo
  const archivoObj = req.files.addfile;
  const archivoData = archivoObj.data.toString();
  const tipoData = req.body.tipoData
  const fileExt = archivoObj.name.split('.')[1]
  
  console.log(tipoData)

  if (tipoData == 1 && fileExt == 'xml'){
    xmlToJson(archivoData)
  }
  else if (tipoData == 4 && fileExt == 'json'){
    jsonToExcel(archivoData)
  } 
  else{
    res.end('no se encuentra este tipo de conversión')
  }


  function jsonToExcel(jsondata) {
    const exceloutput = Date.now() + 'output.xlsx';

    if (isJson(jsondata)) {
      //Validación
      const parsedFile = JSON.parse(jsondata);
      console.log(parsedFile);
      const xls = json2xls(parsedFile);

      fs.writeFileSync(exceloutput, xls, 'binary');
      res.download(exceloutput, (err) => {
        if (err) {
          fs.unlinkSync(exceloutput);
          res.send('Error al descargarl el archivo');
        }
        fs.unlinkSync(exceloutput);
      });
    } else {
      res.send('Datos del archivo Json no son válidos');
    }
  }

  function xmlToJson(xmldata){
    const jsonOutput = Date.now() + 'output.json';
    var result1 = convert.xml2json(xmldata, {compact: true})

  
    fs.writeFileSync(jsonOutput, result1);
    res.download(jsonOutput, (err) => {
      if (err) {
        fs.unlinkSync(jsonOutput);
        res.send('Error al descargar el archivo');
      }
      fs.unlinkSync(jsonOutput);
    });
  }

});

app.listen(PORT, () => {
  console.log('it´s ok on port 3000');
});
