import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Menu, MenuRelations} from '../models';

export class MenuRepository extends DefaultCrudRepository<
  Menu,
  typeof Menu.prototype._id,
  MenuRelations
> {
  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
  ) {
    super(Menu, dataSource);
  }
}
