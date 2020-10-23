import { Component, OnInit } from '@angular/core';
import { PdfMakeWrapper, Txt, Img, Cell, Table} from 'pdfmake-wrapper';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-crear-pdfsura',
  templateUrl: './crear-pdfsura.component.html',
  styleUrls: ['./crear-pdfsura.component.scss']
})
export class CrearPDFSuraComponent implements OnInit {

  MouseMarMod = '';
  MouseSerie = '';
  TecladoMarMod = '';
  TecladoSerie = '';
  MonitorMarMod = '';
  MonitorSerie = '';

  constructor(
    public fechaform: DatePipe,
  ) {}

  ngOnInit() {
  }

  async generarPDFSura(opcion: string, accesorioEquipo: any, fecha: string, datos?: any, nombre ?: string,
                       costo?: string, accesoriosPC?: any[], SoftSOyOF?: any, SoftwareExtra?: any) {
    const pdfSura = new PdfMakeWrapper();
    // Constantes
    const TxtMM = 'Marca / Modelo: ';
    const colorCamposSura = '#c2c2c2';
    const nombreKabec = 'Soluciones Kabec S.A. de C.V.';
    const nombreSura = 'Seguros SURA, S.A. de C.V.';
    const TxtSerie = 'Num. Serie: ';
    const responsableKabec = 'Juan José Vasquez Garcia';
    const imagenLogoKabec = '../../../../assets/img/logoPDF.png';
    const imagenCheck = '../../../../assets/img/check.PNG' ;
    const imagenUnCheck = '../../../../assets/img/uncheck.PNG';
    const Sura = 'SURA';
    let checkLaptop = '';
    let checkEscritorio = '';
    const datosEquipo = datos;
    const responsable = nombre;
    const datosAccesorioEquipo = accesorioEquipo;
    const idEquipo = datosEquipo.mequipo.id_equipo;
    const marca = datosEquipo.mequipo.marca;
    const procesador = datosEquipo.mequipo.procesador;
    const modelo = datosEquipo.mequipo.modelo;
    const memoriaRam = datosEquipo.mequipo.ram;
    const numSerie = datosEquipo.mequipo.numero_serie;
    const discoDuro = datosEquipo.mequipo.disco_duro;
    const marcaElimninador = datosAccesorioEquipo.marca;
    const modeloEliminador = datosAccesorioEquipo.modelo;
    const numSerieEliminador = datosAccesorioEquipo.serie;
    let ifEscritorio = false;
    const nombreSO = SoftSOyOF[0].nombre_software + ' ' + SoftSOyOF[0].version;
    const nombreOfimatica =  SoftSOyOF[1].nombre_software + ' ' + SoftSOyOF[1].version;
    if (datosEquipo.mequipo.tipo_computadora === 'LAPTOP') {
      checkLaptop = imagenCheck;
      checkEscritorio = imagenUnCheck;
    } else if (datosEquipo.mequipo.tipo_computadora === 'ESCRITORIO') {
      checkLaptop = imagenUnCheck;
      checkEscritorio = imagenCheck;
      ifEscritorio = true;
      this.datosMouse(accesoriosPC);
      this.datosPantalla(accesoriosPC);
      this.datosTeclado(accesoriosPC);
    }

    pdfSura.pageMargins([ 75, 60, 75, 60 ]);
    const fechaFormato = fecha;
    pdfSura.add(await new Img(imagenLogoKabec).build(),  // logo
    );
    // Fecha
    pdfSura.add(
      [new Table ([
        [ new Cell(new Txt('México D.F. a ' + fechaFormato).fontSize(9).alignment('right').end).end
        ],
      ]).widths(['100%' ]).layout('noBorders').end,
    ]);
    // Leyenda de encabezado
    pdfSura.add(
      [new Table ([
          [ new Cell(new Txt(nombreKabec).fontSize(9).alignment('left').end).end
          ],
        ]).widths(['100%' ]).layout('noBorders').end,
        new Table ([
          [ new Cell(new Txt('Presente').fontSize(9).alignment('left').end).end
          ],
        ]).widths(['100%' ]).layout('noBorders').end,
        new Table([
          [ new Cell( new Txt('fila').end ).color('white').end],
        ]).layout('noBorders').layout('noBorders').end,
        new Txt([nombreKabec,
          new Txt(', les hace entrega del equipo de compúto con las características y accesorios abajo descritos, ' +
          'dicho equipo estará bajo el uso de ').fontSize(9).background('white').end,
          new Txt(responsable).background(colorCamposSura).end,
          new Txt(' realizando las funciones establecidas por ' + nombreSura + ':').fontSize(9).background('white').end
        ]).fontSize(11).alignment('justify').background(colorCamposSura).end,
    ]);
    // tabla con los datos del equipo
    pdfSura.add(
      [
        new Table([
          [ new Cell( new Txt('fila').end ).color('white').end],
        ]).layout('noBorders').end,
        new Txt('Hardware').bold().fontSize(9).end,
        new Table ([
          [ new Table([
            [
              new Table([
                [
                  await new Img(checkLaptop).build(),
                  new Txt('Laptop').fontSize(11).alignment('left').end
                ]
              ]).layout('noBorders').end,
              new Table([
                [
                  await new Img(checkEscritorio).build(),
                  new Txt('Escritorio').fontSize(11).alignment('left').end
                ]
              ]).layout('noBorders').layout('noBorders').end
            ]
          ]).widths(['35%', '35%']).layout('noBorders').end,
           new Cell(new Txt('').fontSize(9).alignment('left').end).end
          ]
        ]).widths(['50%', '50%']).end,
        new Table ([
          [ new Cell(new Txt(['Marca: ', new Txt(marca).fontSize(11).background(colorCamposSura).end]).end).end,
            new Cell(new Txt(['Procesador: ', new Txt(procesador).fontSize(11).background(colorCamposSura).end]).end).end,
          ],
        ]).widths(['50%', '50%' ]).margin([0, -1 , 0 , 0]).fontSize(9).alignment('left').end,
        new Table ([
          [ new Cell(new Txt(['Modelo: ', new Txt(modelo).fontSize(11).background(colorCamposSura).end]).end).end,
            new Cell(new Txt(['Memoria Ram: ', new Txt(memoriaRam).fontSize(11).background(colorCamposSura).end, new Txt(' GB').end]).end).end,
          ],
        ]).widths(['50%', '50%' ]).margin([0, -1 , 0 , 0]).fontSize(9).alignment('left').end,
        new Table ([
          [ new Cell(new Txt([TxtSerie, new Txt(numSerie).fontSize(11).background(colorCamposSura).end]).end).end,
            new Cell(new Txt(['Disco Duro: ', new Txt(discoDuro).fontSize(11).background(colorCamposSura).end, new Txt(' GB').end]).end).end,
          ],
        ]).widths(['50%', '50%' ]).margin([0, -1 , 0 , 0]).fontSize(9).alignment('left').end,
    ]);
    // tabla con los datos de accesorios
    if (ifEscritorio === false) {
      pdfSura.add( // tabla con los datos del eliminador
        [
          new Table([
            [ new Cell( new Txt('fila').end ).color('white').end],
          ]).layout('noBorders').end,
          new Table ([
            [new Cell(new Txt('Eliminador de Corriente').end).end,
             new Cell(new Txt('Pantalla').end).end
            ]
          ]).widths(['50%', '50%']).fontSize(9).alignment('left').end,
          new Table ([
            [ new Cell(new Txt([TxtMM, new Txt(marcaElimninador + '-' + modeloEliminador).fontSize(11).background(colorCamposSura).end]).end).end,
              new Cell(new Txt([TxtMM, new Txt('   ').fontSize(11).background(colorCamposSura).end]).end).end,
            ],
          ]).widths(['50%', '50%' ]).margin([0, -1 , 0 , 0]).fontSize(9).alignment('left').end,
          new Table ([
            [ new Cell(new Txt([TxtSerie, new Txt(numSerieEliminador).fontSize(11).background(colorCamposSura).end]).end).end,
              new Cell(new Txt([TxtSerie, new Txt(' ').fontSize(11).background(colorCamposSura).end]).end).end,
            ],
          ]).widths(['50%', '50%' ]).margin([0, -1 , 0 , 0]).fontSize(9).alignment('left').end,
      ]);
      // tabla con los datos de accesorios
      pdfSura.add(
        [
          new Table([
            [ new Cell( new Txt('fila').end ).color('white').end],
          ]).layout('noBorders').end,
          new Table ([
            [new Cell(new Txt('Teclado').end).end,
             new Cell(new Txt('Mouse').end).end
            ]
          ]).widths(['50%', '50%']).fontSize(9).alignment('left').end,
          new Table ([
            [ new Cell(new Txt([TxtMM, new Txt('   ').fontSize(11).background(colorCamposSura).end]).end).end,
              new Cell(new Txt([TxtMM, new Txt('   ').fontSize(11).background(colorCamposSura).end]).end).end,
            ],
          ]).widths(['50%', '50%' ]).margin([0, -1 , 0 , 0]).fontSize(9).alignment('left').end,
          new Table ([
            [ new Cell(new Txt([TxtSerie, new Txt('   ').fontSize(11).background(colorCamposSura).end]).end).end,
              new Cell(new Txt([TxtSerie, new Txt('   ').fontSize(11).background(colorCamposSura).end]).end).end,
            ],
          ]).widths(['50%', '50%' ]).margin([0, -1 , 0 , 0]).fontSize(9).alignment('left').end,
      ]);
    } else if (ifEscritorio === true) {
      pdfSura.add( // tabla con los datos del eliminador
        [
          new Table([
            [ new Cell( new Txt('fila').end ).color('white').end],
          ]).layout('noBorders').end,
          new Table ([
            [new Cell(new Txt('Eliminador de Corriente').end).end,
             new Cell(new Txt('Pantalla').end).end
            ]
          ]).widths(['50%', '50%']).fontSize(9).alignment('left').end,
          new Table ([
            [ new Cell(new Txt([TxtMM, new Txt('   ').fontSize(11).background(colorCamposSura).end]).end).end,
              new Cell(new Txt([TxtMM, new Txt(this.MonitorMarMod).fontSize(11).background(colorCamposSura).end]).end).end,
            ],
          ]).widths(['50%', '50%' ]).margin([0, -1 , 0 , 0]).fontSize(9).alignment('left').end,
          new Table ([
            [ new Cell(new Txt([TxtSerie, new Txt('   ').fontSize(11).background(colorCamposSura).end]).end).end,
              new Cell(new Txt([TxtSerie, new Txt(this.MonitorSerie).fontSize(11).background(colorCamposSura).end]).end).end,
            ],
          ]).widths(['50%', '50%' ]).margin([0, -1 , 0 , 0]).fontSize(9).alignment('left').end,
      ]);
      // tabla con los datos de accesorios
      pdfSura.add(
        [
          new Table([
            [ new Cell( new Txt('fila').end ).color('white').end],
          ]).layout('noBorders').end,
          new Table ([
            [new Cell(new Txt('Teclado').end).end,
             new Cell(new Txt('Mouse').end).end
            ]
          ]).widths(['50%', '50%']).fontSize(9).alignment('left').end,
          new Table ([
            [ new Cell(new Txt([TxtMM, new Txt(this.TecladoMarMod).fontSize(11).background(colorCamposSura).end]).end).end,
              new Cell(new Txt([TxtMM, new Txt(this.MouseMarMod).fontSize(11).background(colorCamposSura).end]).end).end,
            ],
          ]).widths(['50%', '50%' ]).margin([0, -1 , 0 , 0]).fontSize(9).alignment('left').end,
          new Table ([
            [ new Cell(new Txt([TxtSerie, new Txt(this.TecladoSerie).fontSize(11).background(colorCamposSura).end]).end).end,
              new Cell(new Txt([TxtSerie, new Txt(this.MouseSerie).fontSize(11).background(colorCamposSura).end]).end).end,
            ],
          ]).widths(['50%', '50%' ]).margin([0, -1 , 0 , 0]).fontSize(9).alignment('left').end,
      ]);
    }
    // Tabla con los datos de Software
    pdfSura.add(
      [
        new Table([
          [ new Cell( new Txt('fila').end ).color('white').end],
        ]).layout('noBorders').end,
        new Txt('Software(únicamente sí se requiere licencia)').bold().fontSize(9).end,
        new Table ([
          [ new Cell(new Txt('Sistema Operativo').end).end,
            new Cell(
              new Txt(['Versión : ',
                new Txt(nombreSO).fontSize(11).background(colorCamposSura).end,
                new Txt(', Service Pack ').end,
                new Txt('   ').fontSize(11).background(colorCamposSura).end,
              ]).end).end,
          ],
        ]).widths(['25%', '50%' ]).margin([0, -1 , 0 , 0]).fontSize(9).alignment('left').end,
        new Table ([
          [ new Cell(new Txt('Office: ').end).end,
            new Cell(
              new Txt([TxtSerie,
                new Txt(nombreOfimatica).fontSize(11).background(colorCamposSura).end,
                new Txt(', Service Pack ').end,
                new Txt('1').fontSize(11).background(colorCamposSura).end,
              ]).end).end,
          ],
        ]).widths(['25%', '50%' ]).margin([0, -1 , 0 , 0]).fontSize(9).alignment('left').end,
    ]);
    // Leyendas del final
    pdfSura.add([
      new Table([
        [ new Cell( new Txt('fila').end ).color('white').end],
      ]).layout('noBorders').end,
      new Txt(['Manifestamos que el equipo descrito en este documento es propiedad de ',
          new Txt(nombreKabec).fontSize(11).background(colorCamposSura).end,
          new Txt(', por lo que asumimos la responsabilidad del mantenimiento y reparación del mismo.' +
          ' De igual manera ').end,
          new Txt(nombreKabec).fontSize(11).background(colorCamposSura).end,
          new Txt(', es responsable del licenciamiento del software instalado hasta la fecha.').end,
        ]).fontSize(9).alignment('justify').end,
        new Table([
          [ new Cell( new Txt('fila').end ).color('white').end],
        ]).layout('noBorders').end,
        new Txt([nombreKabec,
          new Txt(' podrá retirar el equipo de cómputo de las instalaciones en el momento en que ' +
          nombreSura + ' dé su visto bueno.').background('white').fontSize(9).end,
        ]).fontSize(11).alignment('justify').background(colorCamposSura).end,
    ]);
    // Nombre y firmas
    pdfSura.add([
      new Table([
        [ new Cell( new Txt('fila').end ).color('white').end],
      ]).layout('noBorders').end,
      new Table([
        [ new Cell( new Txt('fila').end ).color('white').end],
      ]).layout('noBorders').end,
      new Table ([
        [ new Table([
          [
            new Cell(new Txt('Nombre y firma del repreentante legal de').fontSize(9).background('white').end).end
          ],
          [
            new Cell(new Txt(nombreKabec).end).margin([0, -5 , 0 , 0]).end
          ],
          [
            new Cell(new Txt(responsableKabec).end).margin([0, -5 , 0 , 0]).end
          ],
          [
            new Cell(new Txt('Responsable Soporte Tecnico').end).margin([0, -5 , 0 , 0]).end
          ],
        ]).widths(['100%']).alignment('center').layout('noBorders').fontSize(11).background(colorCamposSura).end,
        new Table([
          [
            new Cell(new Txt('Nombre y firma de quien ocupa el equipo por' ).fontSize(9).background('white').end).end
          ],
          [
            new Cell(new Txt(nombreKabec).end).margin([0, -5 , 0 , 0]).end
          ],
          [
            new Cell(new Txt(responsable).end).margin([0, -5 , 0 , 0]).end
          ],
        ]).widths(['100%']).alignment('center').layout('noBorders').fontSize(11).background(colorCamposSura).end
        ],
      ]).widths(['50%', '50%' ]).fontSize(9).alignment('left').layout('noBorders').end,
    ]);
    pdfSura.add([
      new Table([
        [ new Cell( new Txt('fila').end ).color('white').end],
      ]).layout('noBorders').end,
      new Table([
        [ new Cell( new Txt('fila').end ).color('white').end],
      ]).layout('noBorders').end,
      new Txt('Nombre y firma de quien revisa el equipo').alignment('center').fontSize(9).end,
      new Txt(nombreSura).alignment('center').fontSize(9).end,
    ]);
    // Condicional para mostrar o descargar el docuemnto
    if (opcion === 'vista') {
      pdfSura.create().open();
    } else if (opcion === 'crear') {
      pdfSura.create().download(idEquipo + responsable.replace(' ', '') + Sura + '.pdf');
    }
  }

  datosMouse(datos: any[]) {
    for (const campo of datos) {
      if (campo.producto.toLowerCase().includes('mouse')) {
        this.MouseMarMod = campo.marca + '/' + campo.modelo;
        this.MouseSerie = campo.numero_serie;
      }
    }
  }
  datosTeclado(datos: any[]) {
    for (const campo of datos) {
      if (campo.producto.toLowerCase().includes('teclado')) {
        this.TecladoMarMod = campo.marca + '/' + campo.modelo;
        this.TecladoSerie = campo.numero_serie;
      }
    }
  }
  datosPantalla(datos: any[]) {
    for (const campo of datos) {
      if (campo.producto.toLowerCase().includes('monitor')) {
        this.MonitorMarMod = campo.marca + '/' + campo.modelo;
        this.MonitorSerie = campo.numero_serie;
      }
    }
  }
}
