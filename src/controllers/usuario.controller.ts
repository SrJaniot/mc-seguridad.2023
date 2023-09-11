import {service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  HttpErrors,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {Credenciales, FactorDeAutenticacionPorCodigo, Login, Usuario} from '../models';
import {LoginRepository, UsuarioRepository} from '../repositories';
import {SeguridadUsuarioService} from '../services';

export class UsuarioController {
  constructor(
    //aca van en el constructor todas las demas clases que se nececiten ejemplo repository, service etc.
    @repository(UsuarioRepository)
    public usuarioRepository: UsuarioRepository,
    @service(SeguridadUsuarioService)
    public servicioSeguridad: SeguridadUsuarioService,
    @repository(LoginRepository)
    public loginRepository: LoginRepository,
  ) { }

  @post('/usuario')
  @response(200, {
    description: 'Usuario model instance',
    content: {'application/json': {schema: getModelSchemaRef(Usuario)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {
            title: 'NewUsuario',
            exclude: ['_id'],
          }),
        },
      },
    })
    usuario: Omit<Usuario, '_id'>,
  ): Promise<Usuario> {
    // CREAR LA CLAVE
    let clave = this.servicioSeguridad.crearTextoAeatorio(10);
    //CIFRAR CLAVE
    let claveCifrada = this.servicioSeguridad.cifrarTexto(clave);
    //ASIGNAR LA CLAVE A L USUARO
    usuario.Clave = claveCifrada;
    //ENVIAR UN CORREO DE NOTIFICACION



    return this.usuarioRepository.create(usuario);
  }

  @get('/usuario/count')
  @response(200, {
    description: 'Usuario model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Usuario) where?: Where<Usuario>,
  ): Promise<Count> {
    return this.usuarioRepository.count(where);
  }

  @get('/usuario')
  @response(200, {
    description: 'Array of Usuario model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Usuario, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Usuario) filter?: Filter<Usuario>,
  ): Promise<Usuario[]> {
    return this.usuarioRepository.find(filter);
  }

  @patch('/usuario')
  @response(200, {
    description: 'Usuario PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {partial: true}),
        },
      },
    })
    usuario: Usuario,
    @param.where(Usuario) where?: Where<Usuario>,
  ): Promise<Count> {
    return this.usuarioRepository.updateAll(usuario, where);
  }

  @get('/usuario/{id}')
  @response(200, {
    description: 'Usuario model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Usuario, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Usuario, {exclude: 'where'}) filter?: FilterExcludingWhere<Usuario>
  ): Promise<Usuario> {
    return this.usuarioRepository.findById(id, filter);
  }

  @patch('/usuario/{id}')
  @response(204, {
    description: 'Usuario PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario, {partial: true}),
        },
      },
    })
    usuario: Usuario,
  ): Promise<void> {
    await this.usuarioRepository.updateById(id, usuario);
  }

  @put('/usuario/{id}')
  @response(204, {
    description: 'Usuario PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() usuario: Usuario,
  ): Promise<void> {
    await this.usuarioRepository.replaceById(id, usuario);
  }

  @del('/usuario/{id}')
  @response(204, {
    description: 'Usuario DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.usuarioRepository.deleteById(id);
  }
  /**
   * METODOS PERSONALIZADOS PARA LA API
   */

  @post('/iniciar-sesion')
  @response(200,{
    description:"Identificar un usuario por correo y clave",
    content:{'application/json':{schema: getModelSchemaRef(Usuario)}}
  })
  async identificarUsuario(
    @requestBody(
      {
        content:{
          'application/json' : {
            schema: getModelSchemaRef(Credenciales)
          }
        }
      }
    )
    credenciales: Credenciales
  ):Promise <object>{
    let usuario = await this.servicioSeguridad.identificarUsuario(credenciales);
    if(usuario){
      let codigo2fa = this.servicioSeguridad.crearTextoAeatorio(5);
      let login:Login = new Login();
      //el simbolo "!" es para decir que estamos seguros que ese atributo si va a estar, ya que como "login.usuarioId" es not null pero usuario._id puede ir o no con ! ledecimos que estamos seguros de que llegara algo
      //nececitamos el id del usuario para saber cual usuario se loguea eso va en conjunto con el token y el codigo
      login.usuarioId =usuario._id!;

      login.Code2fa=codigo2fa;
      login.EstadoCode2fa=false;
      login.Token="";
      login.EstadoToken=false;
      this.loginRepository.create(login);
      // notificar al usuario via correo o sms
      return usuario;
    }
    return new HttpErrors[401]("Credenciales incorrectas.");
  }


// metodo de verificar el segundo factor de autenticacion
  @post('/verificar-2fa')
  @response(200,{
    description:"Validar un codigo de 2fa",
    content:{'application/json':{schema: getModelSchemaRef(FactorDeAutenticacionPorCodigo)}}
  })
  async VerificarCodigo2fa(
    @requestBody(
      {
        content:{
          'application/json' : {
            schema: getModelSchemaRef(FactorDeAutenticacionPorCodigo)
          }
        }
      }
    )
    credenciales: FactorDeAutenticacionPorCodigo
  ):Promise <object>{
    let codigo2fa = await this.servicioSeguridad.identificarUsuario(credenciales);
   
    return new HttpErrors[401]("Credenciales incorrectas.");
  }





}
