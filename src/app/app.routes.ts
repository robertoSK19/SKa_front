import { RouterModule, Routes} from '@angular/router';


import { PrincipalComponent } from './Componentes/principal/principal.component';
import { IndexEquiposComponent } from './Componentes/index-equipos/index-equipos.component';
import { AgregarEquiposComponent } from './Componentes/agregar-equipos/agregar-equipos.component';
import {IndexAccesoriosComponent} from './Componentes/index-accesorios/index-accesorios.component';
import {AgregarAccesoriosComponent} from './Componentes/agregar-accesorios/agregar-accesorios.component';
import { LoginComponent } from './Componentes/login/login.component';
import { EditarEquiposComponent } from './Componentes/editar-equipos/editar-equipos.component';



export const APP_ROUTES: Routes = [
{ path: '', component: LoginComponent},
{ path: 'Principal', component: PrincipalComponent},
{ path: 'IndexEquipo', component: IndexEquiposComponent},
{ path: 'AgregarEquipo', component: AgregarEquiposComponent},
{ path: 'IndexAccesorio', component: IndexAccesoriosComponent },
{ path: 'AgregarAccesorio', component: AgregarAccesoriosComponent},
{ path: 'Login',  component: LoginComponent },
{ path: 'EditarEquipo',  component: EditarEquiposComponent },



{ path: '**', pathMatch: 'full', redirectTo: ' Principal '}

];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES);
