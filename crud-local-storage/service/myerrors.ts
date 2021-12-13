/**
 * Error PERSONALIZADO, para COntrolar si el ERROR retotnado 
 * por la función que sea, ES por que el OBJETO ya EXISTA en "la BBDD"
 * Utilizar este ERROR Donde SEA NECESARIO.
 */
export class ItemExist extends Error {
    constructor(message) {
      super(message);
      this.name = "ItemExist";
    }
  }