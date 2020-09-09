import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

const urlBase = 'http://localhost:8088';

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
}
