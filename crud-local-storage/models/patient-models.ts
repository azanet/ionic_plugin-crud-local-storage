//########################################################################################
//  INTERFACES PARA DEFINIR "OBJETOS" Tipo "PATIENT" (esta será la COLECCION "Patients")   ## 
//########################################################################################


import { OptsObjType } from "../interfaces/collections-enum";
import { ObjectDrugModel } from "./vademecum-models";


//Para Identificar por "TIPO" de "VADEMECUM"
export enum KEY_PatientType{
  objtype = 'patient'
}
//Para Identificar MEDICAMENTO INEQUIVOCAMENTE por "Nº DE HISTORIA" de un "PATIENT"
export enum KEY_PatientObjDrug{
  nhistory = 'nhistory'
}


//Para crear OBJETOS! De DOSECALC para el "PatientMedications"
export interface PatientDoseCalc{
  dose: number; //Fecha de la Observacion
  weight: number; //Almacenará UN Objeto DRUG COMPLETO
  concentmg: number;
  concentml: number;
  calculation: number;
}


//Para crear OBJETOS! De PatientMedication para el "ObjectPatientModel"
export interface PatientMedications{
  date: Date; //Fecha de la Observacion
  drug: ObjectDrugModel | string; //Almacenará UN Objeto DRUG COMPLETO o un NOMBRE "personalizado" de medicamento
  dosecalc: PatientDoseCalc; // Dosis calculada para el paciente
}


//Para crear OBJETOS! OBSERVACIÓN para el "ObjectPatientModel"
export interface PatientObservations{
  date: Date; //Fecha de la Observacion
  observation: string;
}


/**
 * MODELO de OBJETO(Medicamento) DE la que se compone la colección de VADEMECUM"
 */ 
export interface ObjectPatientModel {
  objtype: OptsObjType; //Tipo de objeto (KEY COMUN)
  nhistory: string; //num Historial (KEY Para identificarlo como único)
  foto?: string; //Foto en B64
  name: string; //Nombre
  age: number; //Edad
  weight: number; //Peso en KG
  //Contiene Arrays de Objetos "Observations" y "Medications"
  observation?: Array<PatientObservations>; //Objetos de Observaciones
  medication?: Array<PatientMedications>; //Objetos de Medicacion
}

  