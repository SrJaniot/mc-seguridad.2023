import {Entity, model, property, hasMany} from '@loopback/repository';
import {Usuario} from './usuario.model';
import {Menu} from './menu.model';
import {Rolxmenu} from './rolxmenu.model';

@model()
export class Rol extends Entity {
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

  @hasMany(() => Usuario)
  usuarios: Usuario[];

  @hasMany(() => Menu, {through: {model: () => Rolxmenu}})
  menus: Menu[];

  constructor(data?: Partial<Rol>) {
    super(data);
  }
}

export interface RolRelations {
  // describe navigational properties here
}

export type RolWithRelations = Rol & RolRelations;
