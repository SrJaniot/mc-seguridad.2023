import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
  import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
Rol,
Rolxmenu,
Menu,
} from '../models';
import {RolRepository} from '../repositories';

export class RolMenuController {
  constructor(
    @repository(RolRepository) protected rolRepository: RolRepository,
  ) { }

  @get('/rols/{id}/menus', {
    responses: {
      '200': {
        description: 'Array of Rol has many Menu through Rolxmenu',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Menu)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Menu>,
  ): Promise<Menu[]> {
    return this.rolRepository.menus(id).find(filter);
  }

  @post('/rols/{id}/menus', {
    responses: {
      '200': {
        description: 'create a Menu model instance',
        content: {'application/json': {schema: getModelSchemaRef(Menu)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Rol.prototype._id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Menu, {
            title: 'NewMenuInRol',
            exclude: ['_id'],
          }),
        },
      },
    }) menu: Omit<Menu, '_id'>,
  ): Promise<Menu> {
    return this.rolRepository.menus(id).create(menu);
  }

  @patch('/rols/{id}/menus', {
    responses: {
      '200': {
        description: 'Rol.Menu PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Menu, {partial: true}),
        },
      },
    })
    menu: Partial<Menu>,
    @param.query.object('where', getWhereSchemaFor(Menu)) where?: Where<Menu>,
  ): Promise<Count> {
    return this.rolRepository.menus(id).patch(menu, where);
  }

  @del('/rols/{id}/menus', {
    responses: {
      '200': {
        description: 'Rol.Menu DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Menu)) where?: Where<Menu>,
  ): Promise<Count> {
    return this.rolRepository.menus(id).delete(where);
  }
}
