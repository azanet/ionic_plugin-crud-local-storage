//########################################################################################
//  INTERFACES PARA DEFINIR "OBJETOS" Tipo "VADEMECUM" (esta será la COLECCION "Vademecum")   ## 
//########################################################################################
/**
 * Se definen "enum e interfaces" Para trabajar con Objetos VADEMECUM("distintas" PRIMARY_KEYS) 
 * Y Modelo del OBJETO "DRUG" (que será de los objetos que se componga la coleccion "Vademecum" 
 */

import { OptsDrugUnit, OptsVademecApiURL, OptsVademecTitle, OptsVademecType } from "../interfaces/vademecum-enum";
import { OptsObjType } from "../interfaces/collections-enum";


/**
 * NOMBRE DE KEYS- UTILIZADAS PARA CREAR LAS CLAVES_PRIMARIAS
 */

//Para Identificar por "TIPO" de "VADEMECUM"
  export enum KEY_Vademecum{
    objtype = 'objtype'
  }

  //Para Identificar por "TIPO" de "VADEMECUM"
export enum KEY_VademecumType{
  type = 'type'
}
//Para Identificar MEDICAMENTO INEQUIVOCAMENTE por "Nº DE REGISTRO" de un "TIPO" de "VADEMECUM"
export enum KEY_VademecumObjDrug{
  nrecords = 'nrecords'
}


/**
 * MODELO de OBJETO(Medicamento) DE la que se compone la colección de VADEMECUM"
 */ 
export interface ObjectDrugModel {
  objtype: OptsObjType;
  type: OptsVademecType;
  nrecords: string; 
  title: OptsVademecTitle;
  apiurl: OptsVademecApiURL;
  name: string;
  activep?: string;
  laboratory: string;
  cheatsheet?: string;
  dose?: number;
  unit?: OptsDrugUnit;
}

  