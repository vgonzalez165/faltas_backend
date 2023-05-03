const checkString = (str) => {
    const patron = /^[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ0-9\._\-ºª ]*$/;
    return patron.test(str);
  }


const checkEmail = (str) => {
  const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return patron.test(str);
  }

module.exports = {
    checkString,
    checkEmail
}