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
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { EditarEquiposComponent } from './Componentes/editar-equipos/editar-equipos.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import { MatInputModule} from '@angular/material';
import { DatePipe } from '@angular/common';
import { EditarAccesoriosComponent } from './Componentes/editar-accesorios/editar-accesorios.component';
import { IndexResponsivasComponent } from './Componentes/index-responsivas/index-responsivas.component';
import { AgregarResponsivasComponent } from './Componentes/agregar-responsivas/agregar-responsivas.component';
import { MatSelectModule } from '@angular/material';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormularioKabecComponent } from './Componentes/formulario-kabec/formulario-kabec.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { CrearPDFComponent } from './Componentes/formatos_pdf/pdf kabec/crear-pdf.component';
import { PdfMakeWrapper } from 'pdfmake-wrapper';
import pdfFonts from 'pdfmake/build/vfs_fonts'; // fonts provided for pdfmake
import { ToastrModule } from 'ngx-toastr'; // notificaciones
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { IndexUsuariosComponent } from './Componentes/index-usuarios/index-usuarios.component';
import { AgregarUsuariosComponent } from './Componentes/agregar-usuarios/agregar-usuarios.component';
import { EditarUsuariosComponent } from './Componentes/editar-usuarios/editar-usuarios.component';
import { IndexSoftwareComponent } from './Componentes/index-software/index-software.component';
import { EditarSoftwareComponent } from './Componentes/editar-software/editar-software.component';
import { FormularioSuraComponent } from './Componentes/formulario-sura/formulario-sura.component';
import { CrearPDFSuraComponent } from './Componentes/formatos_pdf/crear-pdfsura/crear-pdfsura.component';
import { DialogElementsExampleDialog } from './Componentes/dialog-elements-example-dialog/dialog-elements-example-dialog.component';
import { AgregarSoftwareComponent } from './Componentes/agregar-software/agregar-software.component';
import { MatRadioModule } from '@angular/material/radio';
import { MAT_DATE_LOCALE } from '@angular/material';
import { FormularioKabecAccesoriosComponent } from './Componentes/formulario-kabec-accesorios/formulario-kabec-accesorios.component';
import { PdfKabecAccesoriosComponent } from './Componentes/formatos_pdf/pdf-kabec-accesorios/pdf-kabec-accesorios.component';


// Set the fonts to use
PdfMakeWrapper.setFonts(pdfFonts);

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
    EditarAccesoriosComponent,
    IndexResponsivasComponent,
    AgregarResponsivasComponent,
    FormularioKabecComponent,
    CrearPDFComponent,
    IndexUsuariosComponent,
    AgregarUsuariosComponent,
    EditarUsuariosComponent,
    IndexSoftwareComponent,
    EditarSoftwareComponent,
    FormularioSuraComponent,
    CrearPDFSuraComponent,
    DialogElementsExampleDialog,
    AgregarSoftwareComponent,
    FormularioKabecAccesoriosComponent,
    PdfKabecAccesoriosComponent,
  ],
  entryComponents: [DialogElementsExampleDialog],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    APP_ROUTING,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatMenuModule,
    MatIconModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatRippleModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatRadioModule,
    MatCheckboxModule,
    ToastrModule.forRoot(), // ToastrModule added
    MatProgressSpinnerModule,
  ],
  providers: [CookieService, DatePipe,{ provide: MAT_DATE_LOCALE, useValue: 'es-ES' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
