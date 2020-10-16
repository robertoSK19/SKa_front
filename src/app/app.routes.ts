import { RouterModule, Routes} from '@angular/router';


import { PrincipalComponent } from './Componentes/principal/principal.component';
import { IndexEquiposComponent } from './Componentes/index-equipos/index-equipos.component';
import { AgregarEquiposComponent } from './Componentes/agregar-equipos/agregar-equipos.component';
import {IndexAccesoriosComponent} from './Componentes/index-accesorios/index-accesorios.component';
import {AgregarAccesoriosComponent} from './Componentes/agregar-accesorios/agregar-accesorios.component';
import { LoginComponent } from './Componentes/login/login.component';
import { EditarEquiposComponent } from './Componentes/editar-equipos/editar-equipos.component';
import { EditarAccesoriosComponent } from './Componentes/editar-accesorios/editar-accesorios.component';
import { IndexResponsivasComponent } from './Componentes/index-responsivas/index-responsivas.component';
import { AgregarResponsivasComponent } from './Componentes/agregar-responsivas/agregar-responsivas.component';
import { FormularioKabecComponent } from './Componentes/formulario-kabec/formulario-kabec.component';
import { IndexUsuariosComponent } from './Componentes/index-usuarios/index-usuarios.component';
import { AgregarUsuariosComponent } from './Componentes/agregar-usuarios/agregar-usuarios.component';
import { EditarUsuariosComponent } from './Componentes/editar-usuarios/editar-usuarios.component';
import { IndexSoftwareComponent } from './Componentes/index-software/index-software.component';
import { EditarSoftwareComponent } from './Componentes/editar-software/editar-software.component';
import { FormularioSuraComponent } from './Componentes/formulario-sura/formulario-sura.component';
import { AgregarSoftwareComponent } from './Componentes/agregar-software/agregar-software.component';
import { FormularioKabecAccesoriosComponent } from './Componentes/formulario-kabec-accesorios/formulario-kabec-accesorios.component';


export const APP_ROUTES: Routes = [
{ path: '', component: LoginComponent},
{ path: 'Principal', component: PrincipalComponent},
{ path: 'IndexEquipo', component: IndexEquiposComponent},
{ path: 'AgregarEquipo', component: AgregarEquiposComponent},
{ path: 'IndexAccesorio', component: IndexAccesoriosComponent },
{ path: 'AgregarAccesorio', component: AgregarAccesoriosComponent},
{ path: 'Login',  component: LoginComponent },
{ path: 'EditarEquipo',  component: EditarEquiposComponent },
{ path: 'EditarAccesorio',  component: EditarAccesoriosComponent },
{ path: 'IndexResponsiva',  component: IndexResponsivasComponent },
{ path: 'AgregarResponsiva', component: AgregarResponsivasComponent},
{ path: 'FormularioKabec', component: FormularioKabecComponent},
{ path: 'FormularioKabecAccesorio', component: FormularioKabecAccesoriosComponent},
{ path: 'IndexUsuario', component: IndexUsuariosComponent},
{ path: 'AgregarUsuario', component: AgregarUsuariosComponent},
{ path: 'EditarUsuario', component: EditarUsuariosComponent},
{ path: 'IndexSoftware', component: IndexSoftwareComponent},
{ path: 'EditarSoftware', component: EditarSoftwareComponent},
{ path: 'FormularioSURA', component: FormularioSuraComponent},
{ path: 'AgregarSoftware', component: AgregarSoftwareComponent},


{ path: '**', pathMatch: 'full', redirectTo: ' Principal '}

];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES);
