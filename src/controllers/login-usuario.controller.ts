import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Login,
  Usuario,
} from '../models';
import {LoginRepository} from '../repositories';

export class LoginUsuarioController {
  constructor(
    @repository(LoginRepository)
    public loginRepository: LoginRepository,
  ) { }

  @get('/logins/{id}/usuario', {
    responses: {
      '200': {
        description: 'Usuario belonging to Login',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Usuario),
          },
        },
      },
    },
  })
  async getUsuario(
    @param.path.string('id') id: typeof Login.prototype._id,
  ): Promise<Usuario> {
    return this.loginRepository.usuario(id);
  }
}
