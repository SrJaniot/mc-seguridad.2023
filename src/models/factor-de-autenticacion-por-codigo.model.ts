import {Model, model, property} from '@loopback/repository';

@model()
export class FactorDeAutenticacionPorCodigo extends Model {
  @property({
    type: 'string',
    required: true,
  })
  usuarioID: string;

  @property({
    type: 'string',
    required: true,
  })
  codigo2fa: string;


  constructor(data?: Partial<FactorDeAutenticacionPorCodigo>) {
    super(data);
  }
}

export interface FactorDeAutenticacionPorCodigoRelations {
  // describe navigational properties here
}

export type FactorDeAutenticacionPorCodigoWithRelations = FactorDeAutenticacionPorCodigo & FactorDeAutenticacionPorCodigoRelations;
