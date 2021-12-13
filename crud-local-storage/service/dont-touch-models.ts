//NO TOCAR LAS INTERFACES DE ESTA CLASE!!!!

/**NO TOCARLO!!!!! ES NECESARIO PARA LOS MÉTODOS DEL CRUD.
 * Modelo Para crear el OBJETO que UTILIZAN los MÉTODOS 
 * Del CRUD para devolver las RESPUESTAS del Método ejecutado
 * (Esto pasa por abajo del usuario, NO TOCARLO, ni se preocuparse por el
 * simplemente es necesario para que los métodos puedan trabajar entre ellos). 
 */
export interface ObjResponse {
  storedData: any;
  index: number;
}


/**NO TOCAR!!!!!!!!!!!!!!!
 * Modelo de "SINGLE_PRIMARY_KEY"
 * Utilizar esta Interface para Crear los Objetos PrymaryKey
 * y FACILITARNOS EL TRABAJO, Y PROPORCIONAR SEGURIDAD.
 */
export interface KeyVal_To_PrimaryKey{
  key: string;
  value: string;
}

//NO TOCAAR!!!
//#####################################################################
//  INTERFACE PARA DEFINIR "UNA CLAVE" QUE IDENTIFIQUE LAS COLECCIONES 
//#####################################################################
 /**
  * PK para FILTRAR por TIPO de OBJETOS (Para Obtener COLECCIONES COMPLETAS DE UN TIPO DE OBJETOS)
  * IGUAL QUE SI RECUPERAMOS UNA TABLA EN UNA "BBDD" Relacional
  * 
  * Ejemplo: Para Solicitar la Colección de Objetos TIPO "Medicamento", o TIPO "Personas", o TIPO "loquesea"
  */
  export interface Collection_PK{
    pk1: KeyVal_To_PrimaryKey; //objtype (en mi caso, este es el campo común a TODOS los objetos, y Actua como "Identificador de Tablas")
  }
