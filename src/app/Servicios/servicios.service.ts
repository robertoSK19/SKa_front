import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Usuario } from '../Models/usuario/usuario.interface';

const urlBase = 'http://localhost:8081';
let headersP = new HttpHeaders();
@Injectable({
  providedIn: 'root'
})

export class ServiciosService {

  constructor(
    protected http: HttpClient,
    private cookies: CookieService
  ) { }

  consultaUsuario(correo: string, contraseña: string): Observable<any> {
    const url = urlBase + '/usuarios/con_user?correo=' + correo + '&password=' + contraseña ;
    return this.http.get(url, {observe: 'response'});
  }
  setToken(token: string) {
    this.cookies.set('token', token);
  }
  getToken() {
    return this.cookies.get('token');
  }
  deleteToken() {
    this.cookies.delete('token', '/', 'localhost');
  }
  getAllUsuarios(token: string): Observable <any> {
    const url = urlBase + '/usuarios/get';
    headersP = headersP.set('token', token);
    return this.http.get(url, {headers: headersP, observe: 'response'});
  }
  getRoles(token: string): Observable <any> {
    const url = urlBase + '/roles/get';
    headersP = headersP.set('token', token);
    return this.http.get(url, {observe: 'response', headers: headersP});
  }
  crearUsuario(idRol: number, datosUsuario: Usuario, token: string): Observable <any> {
    headersP = headersP.set('token', token);
    const url = urlBase + '/usuarios/post/' + idRol;
    return this.http.post(url, datosUsuario, {observe: 'response', headers: headersP});
  }
  getUsuario(idUsuario: number, token: string): Observable <any> {
    headersP = headersP.set('token', token);
    const url = urlBase + '/usuarios/get/' + idUsuario;
    return this.http.get(url, {observe: 'response', headers: headersP});
  }
  updateUsuario(idRol: number, datosUsuario: Usuario, token: string ): Observable <any> {
    headersP = headersP.set('token', token, );
    const url = urlBase + '/usuarios/put/' + idRol;
    return  this.http.put(url, datosUsuario, {observe: 'response', headers: headersP});
  }
  borrarUsuario(idUsuario: number, token: string): Observable <any> {
    headersP = headersP.set('token', token);
    const url = urlBase + '/usuarios/' + idUsuario;
    return this.http.delete(url, {observe: 'response', headers: headersP});
  }
}
