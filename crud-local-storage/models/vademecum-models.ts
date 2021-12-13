//########################################################################################
//  INTERFACE PARA DEFINIR "UNA CLAVE" QUE IDENTIFIQUE "subColecciones" de las COLECCIONES 
//########################################################################################
/**
 * MODELO para Objetos VADEMECUM y Modelo de Las "distintas" PRIMARY_KEYS
 * que utilizaremos para trabajar con esta.
 */

import { OptsDrugUnit, OptsVademecApiURL, OptsVademecTitle, OptsVademecType } from "../interfaces/vademecum-enum";
import { OptsObjType } from "../interfaces/collections-enum";



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

  