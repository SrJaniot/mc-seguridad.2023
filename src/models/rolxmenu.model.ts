import {Entity, model, property} from '@loopback/repository';

@model()
export class Rolxmenu extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  _id?: string;

  @property({
    type: 'boolean',
    required: true,
  })
  Listar: boolean;

  @property({
    type: 'boolean',
    required: true,
  })
  Guardar: boolean;

  @property({
    type: 'boolean',
    required: true,
  })
  Editar: boolean;

  @property({
    type: 'boolean',
    required: true,
  })
  Eliminar: boolean;

  @property({
    type: 'boolean',
    required: true,
  })
  Descargar: boolean;

  @property({
    type: 'string',
  })
  rolId?: string;

  @property({
    type: 'string',
  })
  menuId?: string;

  constructor(data?: Partial<Rolxmenu>) {
    super(data);
  }
}

export interface RolxmenuRelations {
  // describe navigational properties here
}

export type RolxmenuWithRelations = Rolxmenu & RolxmenuRelations;
