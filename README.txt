SOLTAR LA CARPETA "crud-local-storage" DENTRO DEL "src"
Como si fuese otro servicio más(que lo és), luego hay que importarlo y declararlo
donde lo vayamos a utilizar.
"Ejemplo del constructor en una clase que emplea este servicio"
  
  constructor(private localStorage: LocalStorageDataService) { }
----------------------------------------------------------------------------

Instalar - Ionic Storage v3 y plugins para SQLite y LocalForage-
https://ionicframework.com/docs/next/angular/storage
https://github.com/ionic-team/ionic-storage

npm install @ionic/storage
npm install @ionic/storage-angular

Hay que realizar unos Imports, etc.. MIRAR LA DOCUMENTACION DEL GITHUB LA

##PLugins para que utilice SQLite y LocalForage, (en caso de poder la Plataforma)

npm install cordova-sqlite-storage
npm install localforage-cordovasqlitedriver
--------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------

--------------------------------------------------------------------------------------------
              ----- README - EXPLICACIÓN ---------------
ESTE PLUGIN, APORTA una capa sobre la librería de Ionic-localStorage v3
que proporciona diversos métodos para CRUD, que incluye lógica para emular PrimaryKeys
para poder trabajar con esta como si fuera una BBDD relacional, 
Tiene la capacidad de establecer uo o varios "key:value" del objeto
para implementar una lógica relacional, y tambien tiene metodos para trabajar 
como una NoSQL.  

LA CARPETA "SERVICE" => NO MODIFICAR los archivos de la carpeta "service".
el archivo "local-storage-data.service.ts" és el que contiene los métodos
que podemos utilizar (o directamente desde donde queramos)
o Lo suyo.. crear un servicio en los que definamos métodos especificos para trabajar 
con cada objeto o coleccion concreta, aportando un poco más de estabilidad y seguridad.

LAS CARPETA "INTERFACES" son en las QUE HAY QUE TRABAJAR (En caso que queramos) 
para crear Enumerados para asignarle a los campos de NUESTROS MODELOS de los Objetos 
con los que vamos a trabajar en nuestra BBDD.

LAS CARPETA "MODELS" (Si queremos)
Es donde modelaremos los OBJETOS y diversas "PrimaryKeys" para 
trabajar recogiendo colecciones, subcolecciones, objetos, etc. ya... Según la lógica que implementemos.
para operar como si fuese una BBDD Relacional.

-------------------------------------------------------------------------------------------------------------
         EXPLICACIÓN/INTENCIÓN DEL FUNCIONAMIMENTO
--------------------------------------------------------------------------------------------------------------
/**
 * LA INTENCIÓN de crear este SERVICIO y SUS INTERFACES 
 * 
 * És tratar de hacer que el funcionamiento del LocalStorage 
 * SE ASEMEJE al de las características de una BBDD Relacional, 
 * PERO, con la libertad de almacenar Objetos.
 * Ya sabemos las ventajas que aporta.. y las desventajas...
 * 
 * Por lo tanto, intentaré aportar 'una capa' que facilite este trabajo
 * y aporte la consistencia que le falta.
 *  
 * SE PRETENDE:
 * -Poder tener la capacidad de crear Multiples usuarios,
 *        con sus 'buckets'(Contenedor o como cada uno se lo imagine),
 * 
 * -Evitar la Duplicidad de los Objetos, 
 * 
 * -Capacidad para poder Recuperar Listas de Objetos, por un KEY:VALUE 'concreto'
 *        y de esta manera poder "SEPARAR" toda la maraña de Objetos 
 *       tratando de "emular" en parte, el comportamiento de Tablas 
 *   >PERO!!, 
 *    Para esto, es necesario que TODOS los OBJETOS que se CREEN/MODELEN 
 *    Tengan EN COMÚN UN MISMO CAMPO("KEY") en mi caso, es el campo "objtype" 
 *    y ya según que "tipo de objeto"
 *    sea pues le seteamos los VALORES("VALUES") 
 *    (DISTINTOS para cada "TABLA", pero IGUALES Si queremos que sean "de la misma familia/tabla"), 
 * 
 *    Por ejemplo:
 *    Hay una interface creada en "/crud-local-storage/interfaces/collections-enum.ts"
 *    concretamente el enum "OptsObjType" en el que asigno los "TIPOS DE OBJETOS QUE VOY A MANEJAR",
 *    lo utilizo para establecerlo en el Correspondiente Objeto Cuando lo cree y 
 *    EVITAMOS errores y le APORTAMOS SEGURIDAD, a que lo escribamos mal o que nos lo escriban mal..
 *    y provocaría INCONSISTENCIA en la BBDD, se quedarían datos mal y colgados por la BBDD,u otras cosas
 *    Y NO QUEREMOS ESO.
 * 
 * -Seguridad en el Eliminado o Modificación.(comprobando que el objeto SEA EXTRICTAMENTE IGUAL)
 * 
 * -Dotar de Métodos que podran ser usados para EMULAR "PrimaryKeys" Una o Varias, 
 *    para esto, recibirá un Array de Objetos, en los que indicaremos los CAMPOS('KEYS'), 
 *    contra los que se realizarán la Verificaciones, 
 *    SE HA DEFINIDO UN "Enum" en "/crud-local-storage/service/dont-touch-models.ts"
 *    LLAMADO "KeyVal_To_PrimaryKey" Que fue creado con la intención de que SE UTILICE
 *    Para la ELABORACIÓN de PRIMARY_KEYS(Simples o Compuestas) a partir del nombre de una "key" del/los Objetos y su "value"
 *    que será lo que utilicemos para "Simular nuestras Relaciónes" y 
 *    así poder tener "TABLAS", "RELACIONES" e "INTEGRIDAD"
 *    Ejemplo del Array de Objeto de KEYS: [{key:"nombreDeTuKey1"},{key:"nombreDeTuKey2"},{las que queramos}]
 *    el método ya se encargará de sacar el VALOR de esas KEYS proporcionadas y COMPROBAR si EXISTE O NO.
 * 
 *  Creo.. que ya está todo. 
 */






//#############################################################
//###### EJEMPLO de COMO se DEBEN CREAR las Primary KEYS ######
//#############################################################

/**Ejemplo de OBJETO para CREAR una PrimaryKey "SIMPLE"
 *  (de un solo campo 'key: value')
 */
Single_PK_Example: KeyVal_To_PrimaryKey = {
  key: "nombreDeLa KEY_COMUN a Esta 'Familia de Objetos' que queremos usar de PK",
  value: "Valor de la 'key' Correspondiente"
}

//#################################

/**CREAR una PrimaryKey "MÚLTIPLE"(de un varios campos 'key: value')
 * UTILIZANDO EL "ENUM" Elaborado para este FIN.
 * Ejemplo de OBJETOS:
 * Por ejemplo.. Puede usarse para simular "relaciones" de Multiples tablas.
 */
Multiple_PK1_Example: KeyVal_To_PrimaryKey = {
  key: "nombreDeLa KEY_COMUN a Esta 'Familia de Objetos' que queremos usar para Formar la PK",
  value: "Valor de la 'key' Correspondiente"
}
Multiple_PK2_Example: KeyVal_To_PrimaryKey = {
  key: "nombreDeLa 'KEY Extra' que queremos usar para Formar la PK",
  value: "Valor de la 'key' Correspondiente"
}
Multiple_PK3_Example: KeyVal_To_PrimaryKey = {
  key: "nombreDeLa 'KEY Extra' que queremos usar para Formar la PK",
  value: "Valor de la 'key' Correspondiente"
}
/**
 * /MONTANDO LA "PK_FINAL" que usaremos para las RELACIONES, 
 * Lo suyo, es crear unos ENUM, definiendo las PK, Que QUERAMOS ESTABLECER PARA cada Objeto MODELADO para la BBDD
 * 
 * (que están creados en las interfaces de la BBDD, USARLOS DE MODELO o MODIFICARLOS A NECESIDAD DIRECTAMENTE)
 * que se , DEFINIENDO LOS MODELOS DE LAS "PK" correspondiente a cada objeto
 * para EVITAR ERRORES en su uso y RESTRINGIR los campos a los que deben ser
*/ 
private Multiple_PK_FINAL: Array<KeyVal_To_PrimaryKey> = [
                              this.Multiple_PK1_Example,
                              this.Multiple_PK2_Example,
                              this.Multiple_PK3_Example
                              ];
//#############################################################
//#############################################################
