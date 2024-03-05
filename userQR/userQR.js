const QRCode = require('qrcode');

// Define el correo electrónico y la contraseña
const username = "Santiago Armendariz";
const email = 'santiago@example.com';
const password = '123456';

// Crea un objeto con el correo electrónico y la contraseña
const datos = {

  email: email,
  password: password,
  username: username,
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
QRCode.toFile(username + '.png', datosEnJson, function (err) {
  if (err) console.error(err);
  console.log('Código QR guardado como archivo');
  // Ahora tienes el archivo 'User1.png' en tu directorio actual.
});
