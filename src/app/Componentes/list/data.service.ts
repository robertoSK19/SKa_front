import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Equipos} from '../../Models/equipos/equipos.interface';

@Injectable({
  providedIn: 'root'
})
export class DataService {
// private urlAPI = 'https://jsonplaceholder.typicode.com/todos';
private urlAPI = 'http://localhost:8088/DEquipos';
private urlAPIEq = 'http://localhost:8088/equipos';
  constructor(private http: HttpClient,
    ) { }

  getAllEquipos(): Observable <any> {
    const url = this.urlAPI + '/get';
    return this.http.get(url, {observe: 'response'});
    //return this.http.get<Equipos[]>(url);
  }
  getEquipo(idEquipo: string): Observable <any> {
    const url = this.urlAPIEq + '?id=' + idEquipo;
    return this.http.get(url, {observe: 'response'});
  }
  updateEquipo(datosEquipo: Equipos): Observable <any> {
    const url = this.urlAPIEq;
    return this.http.put(url, datosEquipo, {observe: 'response'});
  }

}
