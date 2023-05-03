// Recibe una fecha como parámetro en formato DDMMAAAA y devuelve la letra que
// representa el día de la semana en que cae
const fechaToDia = (fechaStr) => {
    const fecha = new Date( fechaStr.slice(4),
                            parseInt(fechaStr.slice(2,4))-1, 
                            fechaStr.slice(0,2),
                            );

    console.log(`-> FechaStr: ${fechaStr}`);
    console.log(`-> Fecha: ${fecha}`);
    return ['D', 'L', 'M', 'X', 'J', 'V', 'S'][fecha.getDay()];
}

module.exports = {
    fechaToDia
}