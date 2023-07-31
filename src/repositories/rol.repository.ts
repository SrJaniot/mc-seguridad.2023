import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory, HasManyThroughRepositoryFactory} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Rol, RolRelations, Usuario, Menu, Rolxmenu} from '../models';
import {UsuarioRepository} from './usuario.repository';
import {RolxmenuRepository} from './rolxmenu.repository';
import {MenuRepository} from './menu.repository';

export class RolRepository extends DefaultCrudRepository<
  Rol,
  typeof Rol.prototype._id,
  RolRelations
> {

  public readonly usuarios: HasManyRepositoryFactory<Usuario, typeof Rol.prototype._id>;

  public readonly menus: HasManyThroughRepositoryFactory<Menu, typeof Menu.prototype._id,
          Rolxmenu,
          typeof Rol.prototype._id
        >;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('UsuarioRepository') protected usuarioRepositoryGetter: Getter<UsuarioRepository>, @repository.getter('RolxmenuRepository') protected rolxmenuRepositoryGetter: Getter<RolxmenuRepository>, @repository.getter('MenuRepository') protected menuRepositoryGetter: Getter<MenuRepository>,
  ) {
    super(Rol, dataSource);
    this.menus = this.createHasManyThroughRepositoryFactoryFor('menus', menuRepositoryGetter, rolxmenuRepositoryGetter,);
    this.registerInclusionResolver('menus', this.menus.inclusionResolver);
    this.usuarios = this.createHasManyRepositoryFactoryFor('usuarios', usuarioRepositoryGetter,);
    this.registerInclusionResolver('usuarios', this.usuarios.inclusionResolver);
  }
}
