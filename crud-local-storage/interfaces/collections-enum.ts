

/**
 * TIPOS de OBJETOS que podemos ENCONTRARNOS en LA BBDD
 * (para luego poder usarlos para filtrar y para los agregados ETC,)
 * ya que esto este tipo de almacenamiento es bastante dificil de controlar
 * Esto se traga todo... ni mira ni comprueba NADA
 * y es la mejor idea que se me ha ocurrido. Espero encontrar una mejor.
*/ 
export enum CommonKey{
  objType = 'objtype'
}

/**
 * TIPOS de "OBJETOS" que va a contener nuestra BBDD
 * Este enum, se utiliza para establecer el campo "objtype"
 * Que es el "campo/key" COMUN para todos los objetos que maneje en la "BBDD"
 * 
 */
export enum OptsObjType{
  vademecum = "vademecum",
  patient = "patient"
}


