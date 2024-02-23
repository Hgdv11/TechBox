const QRCode = require('qrcode');

// Define el usuario y la password
const id = 4;
const name = 'Santiago Armendariz';
const password = '123456';

// Crea un objeto con el usuario y la password
const datos = {
    id: id.toString(),
    name: name,
  password: password
};

// Convierte el objeto a una cadena JSON
const datosEnJson = JSON.stringify(datos);

// Genera el código QR como una URL de imagen (data URL)
QRCode.toDataURL(datosEnJson, function (err, url) {
  if (err) console.error(err);
  console.log(url); // Muestra la URL del QR en la consola
  // Aquí puedes, por ejemplo, mostrar la URL en un frontend o enviarla por email.
});

// Opcionalmente, genera el código QR y guárdalo como un archivo
QRCode.toFile('User4.png', datosEnJson, function (err) {
  if (err) console.error(err);
  console.log('Código QR guardado como archivo');
  // Ahora tienes el archivo 'codigoQR.png' en tu directorio actual.
});