import { OptsObjType } from 'src/plugin/crud-local-storage/interfaces/collections-enum';



/**
 * Tipo de 'Vademecum' al que pertenece
 * será de tipo Veterinario o Humano.
 * @opts veterinary
 * @opts human
 */
export enum OptsVademecType {
  vetVademec= 'veterinary',
  humanVademec ='human'
}



/**URL del 'Vademecum' al que pertenece.
 * 'Devuelve' la URL correspondiente al Tipo
 */
 export enum OptsVademecApiURL {
  vetApiURL = 'https://cimavet.aemps.es',
  humanApiURL = 'https://cima.aemps.es'
}

/**Titulo del 'Vademecum' al que pertenece
 * será de tipo Veterinario o Humano.
 * Y 'Retornará' un titulo correspondiente a su tipo
 */
 export enum OptsVademecTitle {
  vetTitle = 'Vet Vademecum',
  humanTitle = 'Human Vademecum' 
}


/**
 * Medidas Permitidas para las "DRUG" (Medicamentos)
 */
 export enum OptsDrugUnit{
  kilogram = 'Kg',
  gram = 'g',
  milligram = 'mg',
  microgram = 'µg'
}