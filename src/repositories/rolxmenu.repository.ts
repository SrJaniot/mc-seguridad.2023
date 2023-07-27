import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Rolxmenu, RolxmenuRelations} from '../models';

export class RolxmenuRepository extends DefaultCrudRepository<
  Rolxmenu,
  typeof Rolxmenu.prototype._id,
  RolxmenuRelations
> {
  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
  ) {
    super(Rolxmenu, dataSource);
  }
}
