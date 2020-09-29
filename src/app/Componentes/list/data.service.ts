import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Equipos} from '../../Models/equipos/equipos.interface';
import { DEquipos} from '../../Models/equipos/dequipos.interface';
import { Accesorios } from 'src/app/Models/accesorios/accesorios.interface';
import { Asignacion } from 'src/app/Models/asignacion/asignacion.interface';

@Injectable({
  providedIn: 'root'
})
export class DataService {
// private urlAPI = 'https://jsonplaceholder.typicode.com/todos';
private urlAPI = 'http://localhost:8088/DEquipos';
private urlAPIEq = 'http://localhost:8088/equipos';
private urlAPIAc = 'http://localhost:8088/accesorios';
private urlAPIRes = 'http://localhost:8088/responsiva';
private urlAPIAsig = 'http://localhost:8088/asignacion';
private urlAPISoft = 'http://localhost:8088/software';
private urlAPIEstatus = 'http://localhost:8088/estatus';

  constructor(private http: HttpClient,
    ) { }

  getAllEquipos(): Observable <any> {
    const url = this.urlAPI + '/get';
    return this.http.get(url, {observe: 'response'});
    // return this.http.get<Equipos[]>(url);
  }
  getEquipo(idEquipo: string): Observable <any> {
    const url = this.urlAPIEq + '?id=' + idEquipo;
    return this.http.get(url, {observe: 'response'});
  }
  updateEquipo(datosEquipo: Equipos): Observable <any> {
    const url = this.urlAPIEq;
    return this.http.put(url, datosEquipo, {observe: 'response'});
  }
  crearEquipo(equipo: Equipos): Observable<any> {
    const url = this.urlAPIEq + '/post';
    return this.http.post(url, equipo, {observe: 'response'});
  }
  crearDEquipo(dequipo: DEquipos, idEquipo: string): Observable <any> {
    const url = this.urlAPI + '/post?estatus_id=2' + '&equipo_id=' + idEquipo;
    return this.http.post(url, dequipo, {observe: 'response'});
  }
  getDEquipo(id: string): Observable <any> {
    const url = this.urlAPI + '/get/' + id;
    return this.http.get(url, {observe: 'response'});
  }
  updateDEquipo(estatus: number, dequipo: DEquipos) {
    const url = this.urlAPI + '/put?id_estatus=' + estatus;
    return this.http.put(url, dequipo, {observe: 'response'});
  }
  getAllAccesorios(): Observable <any> {
    const url = this.urlAPIAc + '/get';
    return this.http.get(url, {observe: 'response'});
  }
  getAccesorio(idAccesorio): Observable <any> {
    const url = this.urlAPIAc + '/getAccesorio?id=' + idAccesorio;
    return this.http.get(url, {observe: 'response'});
  }
  getAccesorioEquipo(idAccesorio: number) {
    const url = this.urlAPIAc + '/getAccesorioEquipo?id=' + idAccesorio;
    return this.http.get(url, {observe: 'response'});
  }
  crearAccesorio(accesorio: Accesorios, idEstatus: number): Observable <any> {
    const url = this.urlAPIAc + '/post?estatus_id=' + idEstatus;
    return this.http.post(url, accesorio, {observe: 'response'});
  }
  updateAccesorio(accesorio: Accesorios, idEstatus: number): Observable <any> {
    const url = this.urlAPIAc + '/actualizarDatos?estatus_id=' + idEstatus;
    return this.http.put(url, accesorio, { observe: 'response'});
  }
  getAllResponsivas(): Observable <any> {
    const url = this.urlAPIRes + '/get';
    return this.http.get(url, {observe: 'response'});
  }
  crearAsignacion(idDEquipo: number, idEstatus: string, datosAsignacion: Asignacion): Observable <any> {
    const url = this.urlAPIAsig + '/post?dequipo_id=' + idDEquipo + '&estatus_id=' + idEstatus;
    return this.http.post(url, datosAsignacion, {observe: 'response'} );
  }
  crearResponsiva() {

  }
  getAllAsignaciones(): Observable <any> {
    const url = this.urlAPIAsig + '/get';
    return this.http.get(url, {observe: 'response'});
  }
  putResponsiva(idDEquipo: number, idEstatus: number, idAsignacion: number): Observable <any> {
    const url = this.urlAPIAsig + '/put?id_dequipo=' + idDEquipo + '&id_estatus=' + idEstatus + '&id_asignacion=' + idAsignacion;
    return this.http.put(url, {observe: 'response'});
  }
  putResponsivas2(idEquipo: number, idestatus: number , datos: any): Observable <any> {
    const url = this.urlAPIAsig + '/put/' + idEquipo + ',' + idestatus;
    return this.http.put(url, datos, {observe: 'response'});
  }
  getAsignacion(idAsignacion: number): Observable <any> {
    const url = this.urlAPIAsig + '/get/' + idAsignacion;
    return this.http.get(url, {observe: 'response'});
  }
  getAllSoftware(): Observable <any> {
    const url = this.urlAPISoft + '/get';
    return this.http.get(url, {observe: 'response'});
  }
  getAllEstatus(): Observable <any> {
    const url = this.urlAPIEstatus + '/get';
    return this.http.get(url, {observe: 'response'});
  }
}
