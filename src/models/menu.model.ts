import {Entity, model, property, hasMany} from '@loopback/repository';
import {Rol} from './rol.model';
import {Rolxmenu} from './rolxmenu.model';

@model()
export class Menu extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  _id?: string;

  @property({
    type: 'string',
    required: true,
  })
  Nombre: string;

  @property({
    type: 'string',
  })
  Comentario?: string;

  @hasMany(() => Rol, {through: {model: () => Rolxmenu}})
  roles: Rol[];

  constructor(data?: Partial<Menu>) {
    super(data);
  }
}

export interface MenuRelations {
  // describe navigational properties here
}

export type MenuWithRelations = Menu & MenuRelations;
