import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage-angular';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { BehaviorSubject, from, of } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

import { ItemExist } from './myerrors';
import { ObjResponse, KeyVal_To_PrimaryKey } from './dont-touch-models';
import { ObjectDrugModel } from '../models/vademecum-models';



//#########################################################
//Clave del contenedor (utilizado como si fuera el USUARIO) - USUARIO POR DEFECTO
const DEFAULT_USER = 'GUEST';
const DEFAULT_KEY = 'I_AM_THE_GUEST_PASS!';


@Injectable({
  providedIn: 'root'
})


export class LocalStorageDataService {

  //Usuario POR DEFECTO 
  STORAGE_KEY = 'GUEST';

  //Variable para COMPROBAR que los Servicios se hallan INICIADO
  private storageReady = new BehaviorSubject(false);


  /**
   * Ejecuta el método "init", que se encargará de inicializar y 
   * determinar que controlador se utilizará, 
   * dependiendo de la plataforma en la que se ejecute.
   */
  constructor(private storage: Storage) {
    //Lanzamos INIT, y termina el constructor, Init se quedará resolviendo sus problemas solo y ya terminará.
 //   console.time("Constructor: Tiempo de ejecución ");
    console.log("CONSTRUCTOR");

    this.init();
    console.log("FIN DE CONSTRUCTOR");
 //   console.timeEnd("Constructor: Tiempo de ejecución ");
  }

  /**
   * Inicia la BBDD (que está declarandose en el 'app.module.ts')
   */
  private async init() {
    try {
 //     console.time("Init: Tiempo de ejecución ");
      console.log('INIT');
      await this.storage.defineDriver(CordovaSQLiteDriver);
      await this.storage.create();
      console.log('DONE, FIN DE INIT');
      await this.setLOGIN_User_Key(DEFAULT_USER, DEFAULT_KEY);
      this.storageReady.next(true);
 //     console.timeEnd("Init: Tiempo de ejecución ");
    } catch (err) {
      console.log('Error Iniciando la LocalStorage.');
    }
  }

  /** 
   * Función para Cifrar la pass
   */
  private sha512(str) {
    return crypto.subtle.digest("SHA-512", new TextEncoder().encode(str)).then(buf => {
      return Array.prototype.map.call(new Uint8Array(buf), x => (('00' + x.toString(16)).slice(-2))).join('');
    });
  }

  //--------------------------------------------------------




  /**
   * "SOLO COMPRUEBA SI *LA PRIMARY_KEY - proporcionada EXISTE*" 
   * Agregar ITEM/OBJETO a al "bucket" correspondiente al usuario (En caso de no Existir).
   * Recibe un Item, y solo nos preocupamos de:
   * -- o RECOGER el ARRAY que nos devolverá, en caso de INSERTADO CORRECTO.
   * -- o CONTROLAR el ERROR, en caso de que YA Exista o Haya ocurrido un error inesperado.
   *--------------------------------------------------------------------------
   * Se utilizaría para TRABAJAR CON CLAVES,
   * Evitaría la DUPLICIDAD del OBJETO solo si LA PRIMARY_KEY EXISTE  
   * ---------------------------------------------------------------------------
   * 
   * Este Método, LLAMA AL MÉTODO "getItemsCollection_ByMultiple_KeysValues"
   * El cuál le DEVOLVERÁ el "OBJETO" si existe, == si recibimos esto,(NO Agregará el Objeto)
   * Si no Recibimos NADA, significará que no existe == si recibimos esto,(SI SE agregará el OBJETO)
   * -------------------------------------------------------------------------------------
   * 
   * SOLO COMPRUEBA SI *EXISTE ALGUN Objeto "CON LA PRIMARY_KEY PRoporcionada"*
   * @param arrPrimaryKeys - PRIMARY_KEY (LA COMPUESTA, aunque venga Una Sola)
   * @param item - El Item a AGREGAR
   * @return - Devuelve TODO EL "Bucket" del usuario(actualizado)
   * ------------------------------------------------------------------------
   * Ejemplo:
   * const arrBucketReturn = await this.addItem_by_PRIMARY_KEY( PK_FINAL );
  */
   addItem_by_PRIMARY_KEY(arrPrimaryKeys: Array<KeyVal_To_PrimaryKey>,item: ObjectDrugModel) {
    //   const storedData = await this.storage.get(STORAGE_KEY) || [];

    return new Promise((res, err) => {

      this.getItemsCollection_ByMultiple_KeysValues(arrPrimaryKeys).then((objCollect: Array<ObjectDrugModel>) => {

        //Comprobamos que el método NO RETORNE NADA, si no, significa que existe

        if (objCollect.length === 0) {
         //Solicitamos TODO el contenedor para SETEAR La DATA NUEVA
          this.getLocalStoredData().then((resStoredData: Array<ObjectDrugModel>)=> {


            if(resStoredData === null){
              resStoredData = [];
            }
          //añadiendo Resgistro/ENTRADA Nueeva 
          resStoredData.push(item);

          //Guardando los cambios y Retornando la lista actualizada
          res(this.storage.set(this.STORAGE_KEY, resStoredData));

          }).catch(errLS=> 
            err([]) 
          );


        } else {
          //Lanzando Error Personalizado
          err(new ItemExist('El Item ya Existe en la lista!'));
        }

        //Si el Resulta obtenido en el Index es -1, Significa que NO EXISTE EN LA BBDD
      }).catch(objErr => {
        //Controlando el Error, para ver "que retornamos en el Error", Y Que Pueda Contolarse fuera
        if (objErr instanceof ItemExist) {
          //Volvemos a mandar el Error personalizado para que se reciba FUERA!!
          err(new ItemExist('El Item ya Existe en la lista!'));
        } else {
          // console.log('SERVICIO LocalStorage - Error en Intentando Remover el Objeto'+ err);
          err('SERVICIO LocalStorage - Error en Intentando Agregar el Objeto');
        }
      });

    });
  }



  /**
   * Establece el contenedor, de la KEY y Value() que se le pasa,
   * Vamos.. CREA o MODIFICA un CONTENEDOR NUEVO ("Bucket")
   * (Crea un Usuario nuevo, o Puede modificar El Valoe de uno Existente)
   *puede utilizarse para Importar la BBDD o para eliminarla   
   VALUE, ES EL CONTENEDOR ENTERO DEL "USUARIO QUE SEA"
   */
  setUserBucket(key: string, value: any) {

    const res = new Promise((res, err) => {
      this.storage.set(key, value)
        .then(bucketRes => res(bucketRes))
        .catch(bucketErr => err(bucketErr));
    });
    console.log(res);
    return res;
  }

  /**
   * ELIMINA UN "USUARIO"(una Key (la STORAGE_KEY))
   * Ejemplo, En este caso, ELIMINARÍA El Usuario "GUEST" Y TODA SU INFORMACIÓN 
  */
  deleteUSER(STORAGE_KEY: string) {

    const res = new Promise((res, err) => {
      this.storage.remove(STORAGE_KEY)
        .then(removeRes => res(removeRes))
        .catch(removeErr => err(removeErr));
    });
    console.log(res);
    return res;
  }

  /**
   * Eliminar TODA la BBDD ENTERA, la deja LIMPIA como una PATENA, *CUIDAO*. ENTERA.
  */
  deleteAllBBDD() {

    const res = new Promise((res, err) => {
      this.storage.clear()
        .then(cleareRes => res(cleareRes))
        .catch(clearErr => err(clearErr));
    });
    console.log(res);
    return res;
  }

  //------------------------------------------------------------------------------


  /**
   * Creando "Login" para establecer un Contenedor para un Usuario (si el user no Existe se crea Uno nuevo)
   * Cifrando 10 veces la PASS con SHA512, antes de establecerla al contenedor
   */
  async setLOGIN_User_Key(user: string, pass: string) {
    try {
      let passSHA512 = pass;

      for (let index = 0; index < 10; index++) {
        const cypher = await this.sha512(passSHA512);
        passSHA512 = Object(cypher).toString();
      }
      //Almacenando el User, con la clave cifrada en SHA512 con 10 iteraciones
      this.STORAGE_KEY = user + ":" + passSHA512;
      //    console.log(this.STORAGE_KEY);
    } catch (err) {
      console.log('ERROR estableciendo el USER:KEY para el Contenedor.');
    }
  }


  /** Cargando Datos del almacenamiento (o la BBDD)
   * Y lo retornamos, 
   * Con este método, nos ASEGURAMOS de que NO se soliciten los DATOS
   * Antes de que estén iniciados los servicios del Storage
   */
  getLocalStoredData() {

 //   console.log("Cargando Data");
    return new Promise(res => {
      this.getBucketData().subscribe(response => {
        res(response);
        //    console.log(response)
      })

    });
  }

  /**
   * "SOLO COMPRUEBA SI SON *ESTRICTAMENTE IGUALES*" 
   * Agregar ITEM/OBJETO a al "bucket" correspondiente al usuario (En caso de no Existir).
   * Recibe un Item, y solo nos preocupamos de:
   * -- o RECOGER el ARRAY que nos devolverá, en caso de INSERTADO CORRECTO.
   * -- o CONTROLAR el ERROR, en caso de que YA Exista o Haya ocurrido un error inesperado.
   *--------------------------------------------------------------------------
   * Se utilizaría para TRABAJAR SIN CLAVES,
   * Evitaría la DUPLICIDAD del OBJETO solo si es IDENTICO
   * En caso de cambiar una sola letra, el Objeto SE AGREGARÍA   
   * ---------------------------------------------------------------------------
   * 
   * Este Método, LLAMA AL MÉTODO "getItemIndex_And_ReturnAllBuck"
   * El cuál le DEVOLVERÁ el "Index"(-1 si no existe, -2 si la DDBB está vacía) == si recibimos esto,(Agregará el Objeto)
   * o si es 0 o MAYOR, será el indice del Objeto(Significará que existe) == si recibimos esto,(No se agregará el OBJETO)
   * Aparte del INDICE, También RECIBIMOS toda la LISTA (el "bucket" del USUARIO ACTUAL) ACTUALIZADA. 
   * (Sobra decir que viene TODO el "bucket" correspondiente al usuario)
   * -------------------------------------------------------------------------------------
   * 
   * SOLO COMPRUEBA SI *EXISTE ALGUN Objeto "IDENTICAMENTE IGUAL"*
   * 
   * *REITERO:* 
   * **"SOLO COMPRUEBA SI SON ESTRICTAMENTE IGUALES"**
   * @param item - El Item a AGREGAR
   * @return - Devuelve una LISTA de OBJETOS ACTUALIZADA
   * @error - Hay que controlar el ERROR, si es "instanceof ItemExist" es que el Item, ya existía.
   *          En caso de ser otra cosa, es un error no controlado
   * ------------------------------------------------------------------------
   * Ejemplo:
   * const arrBucketReturn = await this.addItem_IfNotStrictlySame({ nombre: "pepito grillo" });
  */
  addItem_IfNot_StrictlySame(item) {
    //   const storedData = await this.storage.get(STORAGE_KEY) || [];

    return new Promise((res, err) => {

      this.getItemIndex_And_ReturnAllBuck(item).then(objResponse => {

        if ( objResponse.storedData === null || objResponse.index <= -1) {

          if(objResponse.storedData === null){
            objResponse.storedData = [];
          }

          //añadiendo Resgistro/ENTRADA Nueeva 
          objResponse.storedData.push(item);
          //Guardando los cambios y Retornando la lista actualizada
          res(this.storage.set(this.STORAGE_KEY, objResponse.storedData));

        } else {
          //Lanzando Error Personalizado
          err(new ItemExist('El Item ya Existe en la lista!'));
        }

        //Si el Resulta obtenido en el Index es -1, Significa que NO EXISTE EN LA BBDD
      }).catch(objErr => {
        //Controlando el Error, para ver "que retornamos en el Error", Y Que Pueda Contolarse fuera
        if (objErr instanceof ItemExist) {
          //Volvemos a mandar el Error personalizado para que se reciba FUERA!!
          err(new ItemExist('El Item ya Existe en la lista!'));
        } else {
          // console.log('SERVICIO LocalStorage - Error en Intentando Remover el Objeto'+ err);
          err('SERVICIO LocalStorage - Error en Intentando Agregar el Objeto');
        }
      });

    });
  }

  /**
   * Recibe el ITEM Antiguo(Original), y el ITEM ACTUALIZADO.
   * Con el objeto Viejo, buscamos en qué Index se encuentra.
   * LO BUSCARá QUE SEA EXTRICTAMENTE IGUAL, Si no NO VA A MODIFICAR NADA. (Por seguridad)
   * Si Hasta aquí todo va bien,
   * Esta vez Buscará que el NUEVO OBJETO NO SEA ESTRICTAMENTE IGUAL A NINGUN OTRO OBJETO ALMACENADO EN LA BBDD
   * Y si esto también va BIEN,
   * Cambiará el Objeto Viejo por el Objeto Nuevo (cogemos directamente el INDEX retornaso del objetoViejo 
   * en la BBDD y procedemos a ASIGNARLE el ObjetoNuevo)
   * Posteriormente, seteamos el "bucket" con la nueva información y RETORNAMOS la Data Actualizada.
   * Quedando nuestro objeto actualizado. 
   */
  updateItem(oldItem, newItem) {

    return new Promise((res, err) => {
      //Recogiendo el INDEX y todo el "buck del usuario" (que viene en una promesa),  
      this.getItemIndex_And_ReturnAllBuck(oldItem).then(objRes => {

        //Comprobamos si oldItem EXISTE en la BBDD
        if (objRes.index > -1) {
          //       console.log('EL OBJETO-VIEJO EXISTE en la BBDD!!:');

          objRes.storedData.forEach(element => {
            if (JSON.stringify(element) === JSON.stringify(newItem)) {
              err('El objeto NUEVO, Ya existe en la BBDD')
            }
          });

          //Establecemos el Objeto NUEVO
          objRes.storedData[objRes.index] = newItem;
          //       console.log('agregando objeto modificado!!')
          res(this.storage.set(this.STORAGE_KEY, objRes.storedData));

        } else {
          err('EL OBJETO-VIEJO NO EXISTE en la BBDD!!:');
        }

      }).catch(indError => {
        //RETORNANDO ERROR, DIRECTAMENTE A LA "PRIMERA" PROMESA 
        // console.log('SERVICIO LocalStorage - Error en Intentando Remover el Objeto'+ err);
        err('SERVICIO LocalStorage - Error en Intentando Remover el Objeto');
      });
    });
  }

  /**
   * Eliminar Dato del Contenedor
   * Recibe un Item, y llama a la función para localizar SU index y encargarse de borrarlo
   * "SOLO COMPRUEBA SI SON *ESTRICTAMENTE IGUALES*".
   * No es necesario trabajar con "las PK emuladas", se le pasa el objeto al completo y ya está.
   * 
   * @param item - El Item a eliminar
   * @return - Devuelve PROMESA con una LISTA de OBJETOS ACTUALIZADA
   * await this._IfIsStrictlySame({ pepito: "grillo" });
  */
  removeItem_If_StrictlySame(item) {
    //   const storedData = await this.storage.get(STORAGE_KEY) || [];
    return new Promise((res, err) => {

      //Recogiendo el INDEX (que viene en una promesa), y trabajamos con el, Posteriormente decidiremos que retornar 
      this.getItemIndex_And_ReturnAllBuck(item).then(objRes => {

        if (objRes.index > -1) {
          objRes.storedData.splice(objRes.index, 1);
  //        console.log('SERVICIO LocalStorage - Dentro del removee!!:' + objRes.index + objRes.storedData);
          this.storage.set(this.STORAGE_KEY, objRes.storedData);
          res(true);
        }else{

          res(false);
        }

      }).catch(indError => {
        //RETORNANDO ERROR, DIRECTAMENTE A LA "PRIMERA" PROMESA 
        // console.log('SERVICIO LocalStorage - Error en Intentando Remover el Objeto'+ err);
        err('SERVICIO LocalStorage - Error en Intentando Remover el Objeto');
      });
    });

  }

  /**
   * OBTENER "ARRAY" DE "OBJETOS/REGISTROS" QUE CUMPLAN CON LAS 'KEYS':'VALUE' Que necesitemos comprobar
   * 
   * 
   ****DEBE UTILIZARSE, si queremos "EMULAR las PrimaryKeys" a la Hora de la INSERCIÓN de OBJETOS
   *         este es el método que dará "consistencia" y evitar "LA DUPLICIDAD en las TABLAS".
   * 
   * -Puede Utilizarse para retornar UNO o VARIOS, ITems/Objetos, ya que retornará un ARRAY.
   * -Puede UTILIZARSE, para BUSQUEDAS "filtradas" desde un search por ejemplo..
   * 
   * #######################################################################################################
   * 
   * SE HA CREADO UNA INTERFACE "KeyVal_To_PrimaryKey", para FACILITAR la creacion "OBJETOS: KeyVal_To_PrimaryKey" 
   * Sin que haya confusiones.
   * 
   * SOLO HAY QUE CREAR un OBJETO<KeyVal_To_PrimaryKey> por CADA "KEY" CON LA QUE QUERAMOS FORMAR NUESTRA 
   * PRIMARY_KEY FINAL, o bien le pasamos las claves dentro de un array, o creamos un objeto P_KEY que contenga tod
   * las "claves" de las que queremos que se componga.
   * 
   * ------------------------------------------------------------------------------------------
   *#########//EJEMPLO DE PREPARACIÓN DE P_KEYs Y CONSUMO DEL MÉTODO
   *------------------------------------------------------------------------------------------
   * PK_1: KeyVal_To_PrimaryKey = {key:'nombreDeLaKey1',value:'Valor de la KEY1'};
   * PK_2: KeyVal_To_PrimaryKey = {key:'nombreDeLaKey2',value:'Valor de la KEY2'};  
   * PK_FINAL = [ PK_1, PK2 ];
   * const arrObjRet = await this.getItemsCollection_ByMultipleKeysValues(PK_FINAL);
   * 
   * 
   * ######################################################################################################3
   * ------------------------------------------------------------------------------------
   * (Podría ser UTILIZADO PARA posterior Eliminado, Modificado,('masivo') o Mostrarlos )
   * 
   * 
   * (ESTE Código NOS PERMITE REUTILIZAR ESTE MÉTODO, CREANDO OTROS MÉTODOS(simples) Para CONSUMIRLO.
   * que Lo suyo esque estén aquí en el servicio junto a estos 
   * para evitar que el usuario los manipule, ASEGURANDONOS de que el método invocado va a llamar 
   * AL CAMPO QUE ESPERAMOS Y NO OTRO!! que después.. vienen los problemas, 
   * Ya que el RETORNO podría ser una lista que no queramos mostrar...). 
   * 
   * EJEMPLO/MOTIVO para el uso de este método:
   * 
   * -POR EJEMPLO para asegurarnos de que "en la Colección de "vademecum", 
   *    no puedan ingresarse DOS MEDICAMENTOS con el Mismo Nº de Registro
   *    y "EMULAR" el comportamiento que tendría una BBDD relacional.
   * 
   *///--------------------------------------------------------------------------------
  getItemsCollection_ByMultiple_KeysValues(arrPrimaryKeys: Array<KeyVal_To_PrimaryKey>) {

    let list = []; //Contendrá las coincidencias encontradas de la Busqueda

    return new Promise(res => {
      //Resolvemos el observable
      this.getBucketData().subscribe((data: any) => {

        //_Comprobamos que no esté vacia la RESPUESTA
        if (data != null && data.length > 0) {
          //@Key   => Es el valor COMPLETO del registro correspondiente a esa posicion 
          //@value => El NUMERO de INDEX en el que el REGISTRO está en la lista
          //@index => retorna TODOS los INDEX de los Registros actuales   
          //Iterando TODA la DATA del LocalStorage
          data.forEach((key, value, index) => {

            let exist = true;//Variable para controlar SI CUMPLE con TODOS los KEY/VALUES que RECIBE

            //ITERAMOS el Arreglo de KEY/VALUES enviado para "EMULAR LAS PRIMARY_KEYS"
            arrPrimaryKeys.forEach(arrKeyValue => {

              if (key[arrKeyValue['key']] !== arrKeyValue['value']) {
                exist = false;
              }
            });
            if (exist) {
              list.push(key);
            }
          });
        }
        res(list);
      });
    });
  }

  /**
   * OBTENER "ARRAY" DE "OBJETOS/REGISTROS" QUE CUMPLAN CON LA 'KEY':'VALUE' ESPECIFICADA POR EL USUARIO
   * 
   * Este método es el que está pensando para que "Emule la RECUPERACIÓN DE TABLAS" (es como su fuera.. una PrimaryKey
   * pero en verdad.. ofrece poca fiabilidad, es más bien eso, para agrupar por colecciones/familia o no se como llamarlo)
   * 
   * 
   * Este método PUEDE ser empleado para recuperar listas de objetos, QUE CUMPLAN con la condición de
   *  KEY : VALUE que le sea proporcionado.
   * (Podría ser UTILIZADO PARA posterior Eliminado, Modificado,('masivo') o Mostrarlos )
   * 
   * 
   * (ESTO NOS PERMITE REUTILIZAR ESTE MÉTODO, CREANDO OTROS MÉTODOS(simples) y que Lo suyo esque estén
   * aquí en el servicio junto a estos 
   * para evitar que el usuario los manipule, ASEGURANDONOS de que el método invocado va a llamar 
   * AL CAMPO QUE ESPERAMOS Y NO OTRO!! que después.. vienen los problemas, 
   * Ya que el RETORNO podría ser una lista que no queramos mostrar...). 
   * 
   * por ejemplo para separar "objetos pacientes" de "objetos medicamentos" y "EMULAR" el comportamiento
   * que tendría una BBDD relacional
   * 
   * ------------------------------------------------------------------------------------------------------
   *#### SE HA CREADO UNA INTERFACE "KeyVal_To_PrimaryKey", 
   para FACILITAR la creacion del "OBJETO: KeyVal_To_PrimaryKey;"
   * Sin que haya confusiones.
   * 
   * SOLO HAY QUE CREAR un OBJETO<KeyVal_To_PrimaryKey>, que necesita el nombre de la "key" que tiene que buscar
   * y el "value", que es el valor que queremos que corresponda a esa "key" y yasta, se lo pasamos al método 
   * que este nos devolverá un Array de Objetos con las coincidencias encontradas.
   * 
   *  
   * ------------------------------------------------------------------------------------------
   *#########//EJEMPLO DE PREPARACIÓN DE P_KEY Y CONSUMO DEL MÉTODO
   *------------------------------------------------------------------------------------------
   * //Contruimos el Objeto que "simula la PrimaryKey".
   * PK: KeyVal_To_PrimaryKey = {key:'nombreDeLaKey1',value:'Valor de la KEY1'};
   * //Y consumimos el método.
   * const arrObjRet = await this.getItemsCollection_BySingle_KeyValue(PK);
   * 
   */
  getItemsCollection_BySingle_KeyValue(primaryKeyObj: KeyVal_To_PrimaryKey) {

    let list = []; //Contendrá las coincidencias encontradas de la Busqueda

    return new Promise(res => {
      //Resolvemos el observable
      this.getBucketData().subscribe((data: any) => {

        //_Comprobamos que no esté vacia la RESPUESTA
        if (data != null && data.length > 0) {
          //@Key   => Es el valor COMPLETO del registro correspondiente a esa posicion 
          //@value => El NUMERO de INDEX en el que el REGISTRO está en la lista
          //@index => retorna TODOS los INDEX de los Registros actuales   
          data.forEach((key, value, index) => {

            console.log(key[primaryKeyObj.key] === primaryKeyObj.value);
            //DETERMINANDO si el valor de la 'KEY' Proporcionada, coincide con el "VALUE" proporcionado
            if (key[primaryKeyObj.key] === primaryKeyObj.value) {
              list.push((key));//Almacenando valor en al ArrayList
            }
          });
        }
        res(list);
      });
    });
  }


  //-------------------------------------------------------------------------------------------
  /**
    * Obteniendo "DATA del CONTENEDOR("Bucket") sociado al USUARIO actual" 
    * SE ASEGURA DE QUE "TODO ESTé CARGADO"- (No devuelve los datos Hasta que el servicio esté listo)
    * Evitando Errores
    * (por defecto se monta un user "GUEST")
    * RETORNA UN OBSERVABLEE!!
    */
  private getBucketData(): any {
//    console.log('GET DATA');
    //Asegurandonos de que EL ALMACENAMIENTO está PREPARADO!
    return this.storageReady.pipe(
      filter(ready => ready),
      switchMap(_ => {
        return from(this.storage.get(this.STORAGE_KEY)) || of([]);
      })
    );


  }


  /**
 * Función que RETORNA el "INDEX" del Objeto pasado.
 * Comparará QUE SEA ESTRICTAMENTE IGUAL, al de la BBDD.
 * Comprueba que la BBDD está CARGADA antes de operar. 
 * 
 ** TENDRÁ QUE SER UTILIZADO PARA TODO, (CRUD)**
 * ya que es la unica manera de Identificar el Objeto y poder modificarlo, evitar duplicidad, etc.
 * (o eso o establecemos unas "claves primarias" que nos inventemos)(combinando campos, etc)
 * 
 * @param item - Es el objeto COMPLETO que queremos Comporbar si existe o no
 * @returns - Retorna una PROMESA, que contiene un OBJETO, que CONTIENE "la DATA de la BBDD,
 *            y el INDEX en el que se encuentra (O NO),(-1) Si NO EXISTE.  mayor de (-1) significa que EXISTE. -2 que la BBDD está VACÍA
 * ------------------------------------------------------------------
 * Linea de ejemplo
 * console.log('Esto retorna el INDEX del Item '+ await this.getUniqueObjectIndex({ pepito: "grillo" }));
 */
  private getItemIndex_And_ReturnAllBuck(item): Promise<ObjResponse> {

    //Creamos un OBJETO, que será lo que DEVUELVA PROMESA.() Porlomenos en caso de Error o vacío)
    let objResponse: ObjResponse = {
      storedData: [],
      index: -1
    };


    //Retornamos una promesa del observable
    return new Promise((res, err) => {
      //Resolvemos el observable
      this.getBucketData().subscribe(storedData => {

        //_Comprobamos que Existan Datos en la BBDD (que viene de la RESPUESTA del 'getData()')
        if (storedData != null && storedData.length > 0) {

          objResponse.storedData = storedData;//Seteando al OBJETO con la DATA recuperada del 'getData()'
          //@Key   => Es el valor COMPLETO del registro correspondiente a esa posicion 
          //@value => El NUMERO de INDEX en el que el REGISTRO está en la lista
          //@index => retorna TODOS los INDEX de los Registros actuales      

          storedData.forEach((key, value, index) => {

            //Determiando si Los Objetos SON IDENTICAMENTE IGUALES (Identicos)
            if (JSON.stringify(key) === JSON.stringify(item)) {
  //            console.log('SERVICIO LocalStorage - LOS ITEMS COINCIDEEEN!!!!!' + value);
              //En caso de encontrarse en la coleccion, Retornamos el "value" (que se corresponde con el INDEX OFICIAL del Item)
              objResponse.index = value;//Seteando al OBJETO con el INDEX al que pertenece
              res(objResponse); //Seteamos 'el valor BUENO' de la Promesa(será lo que devuelva. nuestor index)
            } else {
  //            console.log('SERVICIO LocalStorage -LOS ITEMS  no coincideen!!');
            }
          });
          //En caso de NO encontrarse en la coleccion, Retornamos el "-1" que se corresponde con LA AUSENCIA del Item en la BBDD
          res(objResponse);//Seteamos 'el valor Bueno' de la Promesa(será lo que devuelva. nuestor index)

        } else {
          //Devolvemos la "storedData" y el "index en el que se encuentra"
          objResponse.index = -2; //Le Asignamos -2 al Index, para indicar que LA BBDD ESTÁ Vacía.
          res(objResponse);
        }

        err("No se ha Retornado Ningún Valor, Ha ocurrido algo Inesperado.")
      });
    });
  }








/**
 * Igual que el de Retornar las coleccion por las PK, 
 * pero este comprueba SI CONTIENE PARTE DEL "VALUE",de las Keys que se les pasa
 * PARA PODER REALIZAR BÚSQUEDAS Y RETORNAR COINCIDENCIAS.
 * @param arrPrimaryKeys 
 * @returns 
 */
  findItemsCollection_ByMultiple_KeysValues(arrPrimaryKeys: Array<KeyVal_To_PrimaryKey>) {

    let list = []; //Contendrá las coincidencias encontradas de la Busqueda

    return new Promise(res => {
      //Resolvemos el observable
      this.getBucketData().subscribe((data: any) => {

        //_Comprobamos que no esté vacia la RESPUESTA
        if (data != null && data.length > 0) {
          //@Key   => Es el valor COMPLETO del registro correspondiente a esa posicion 
          //@value => El NUMERO de INDEX en el que el REGISTRO está en la lista
          //@index => retorna TODOS los INDEX de los Registros actuales   
          //Iterando TODA la DATA del LocalStorage
          data.forEach((key, value, index) => {

            let exist = true;//Variable para controlar SI CUMPLE con TODOS los KEY/VALUES que RECIBE

            //ITERAMOS el Arreglo de KEY/VALUES enviado para "EMULAR LAS PRIMARY_KEYS"
            arrPrimaryKeys.forEach(arrKeyValue => {

              if ((key[arrKeyValue['key']]).toString().toUpperCase().includes(arrKeyValue['value'].toUpperCase()) === false) {
                exist = false;
              }
            });
            if (exist) {
              list.push(key);
            }
          });
        }
        res(list);
      });
    });
  }











}


