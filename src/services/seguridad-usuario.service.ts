import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import {Credenciales, FactorDeAutenticacionPorCodigo, Login, Usuario} from '../models';
import {repository} from '@loopback/repository';
import {LoginRepository, UsuarioRepository} from '../repositories';

//import de la variable que usaremos para generar claves npm install generate-password
const generator = require('generate-password');
//import de la variable que usaremos para encriptar claves npm i crypto-js
const  MD5 = require("crypto-js/md5");


@injectable({scope: BindingScope.TRANSIENT})
export class SeguridadUsuarioService {
  constructor(
    @repository(UsuarioRepository)
    public repositorioUsuario: UsuarioRepository,
    @repository(LoginRepository)
    public repositorioLogin: LoginRepository,
  ) { }

  /*
   * Add service methods here
   */




  //funcion que me genera clave aleatoria con tamaño 10 y con numneros npm install generate-password .
  /**
   *
   * @returns contraseña de n caracteres aleatoria
   */
  crearTextoAeatorio (n: number): string{
    let clave = generator.generate({
      length: n,
      numbers: true
    });
    return clave;
  }



//funcion que me encripta un texto en MD5 npm i crypto-js
/**
 *
 * @param texto cadeba que voy a cifrar
 * @returns cadena cifrada con MD5
 */
  cifrarTexto(texto:string):string{
    let cadenaCifrada =MD5(texto).toString();
    return cadenaCifrada;
  }


  /**
   * Se busca un usuario por las credenciales de acceso correo y contraseña
   * @param credenciales credenciales del usuario
   * @returns usuario encontrado o null
   */

  async identificarUsuario(credenciales: Credenciales):Promise <Usuario | null>{
    let usuario= await this.repositorioUsuario.findOne({
      where:{
        Correo: credenciales.correo,
        Clave: credenciales.clave,
      }
    });
    return usuario as Usuario;

  }


  /**
   * VALIDA UN CODIGO DE 2FA PARA UN USUARIO
   * @param credenciales2fa credenciales del usuario con el codigo 2fa
   * @returns el registro de login o null
   */


  async validarCodigo2fa(credenciales2fa: FactorDeAutenticacionPorCodigo):Promise <Login | null> {
    let login = await this.repositorioLogin.findOne({
      where:{
        usuarioId: credenciales2fa.usuarioID,
        Code2fa: credenciales2fa.codigo2fa,
        EstadoCode2fa:false
      }

    });
    //este return es como un if: retorneme loguin si hay login si no retorneme null
    return (login) ? login : null;

  }


}
