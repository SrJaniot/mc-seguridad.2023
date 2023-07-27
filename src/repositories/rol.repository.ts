import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Rol, RolRelations} from '../models';

export class RolRepository extends DefaultCrudRepository<
  Rol,
  typeof Rol.prototype._id,
  RolRelations
> {
  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
  ) {
    super(Rol, dataSource);
  }
}
