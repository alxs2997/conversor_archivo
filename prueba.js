var fs = require('fs');
var isJson = require('is-json');
var json2xls = require('json2xls');

convertToExcel();

function convertToExcel() {
  const filename = 'cursosUGB.json';
  const jsondata = fs.readFileSync(`${__dirname}/temp/${filename}`, 'utf8');

  var exceloutput = Date.now() + 'output.xlsx';
  console.log(jsondata);

  if (isJson(jsondata)) {
    //Validación
    console.log(JSON.parse(jsondata));
    var xls = json2xls(JSON.parse(jsondata));

    fs.writeFileSync(exceloutput, xls, 'binary');
  } else {
    console.log('Datos del archivo Json no son válidos');
  }
}
