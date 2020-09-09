import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

// RUTAS
import {APP_ROUTING} from './app.routes';





import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PrincipalComponent } from './Componentes/principal/principal.component';
import { NavbarComponent } from './Componentes/navbar/navbar.component';
import { AgregarEquiposComponent } from './Componentes/agregar-equipos/agregar-equipos.component';
import { IndexEquiposComponent } from './Componentes/index-equipos/index-equipos.component';
import { from } from 'rxjs';
import { IndexAccesoriosComponent } from './Componentes/index-accesorios/index-accesorios.component';
import { AgregarAccesoriosComponent } from './Componentes/agregar-accesorios/agregar-accesorios.component';
import { LoginComponent } from './Componentes/login/login.component';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import { EditarEquiposComponent } from './Componentes/editar-equipos/editar-equipos.component';

@NgModule({
  declarations: [
    AppComponent,
    PrincipalComponent,
    NavbarComponent,
    AgregarEquiposComponent,
    IndexEquiposComponent,
    IndexAccesoriosComponent,
    AgregarAccesoriosComponent,
    LoginComponent,
    EditarEquiposComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    APP_ROUTING,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatIconModule
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
