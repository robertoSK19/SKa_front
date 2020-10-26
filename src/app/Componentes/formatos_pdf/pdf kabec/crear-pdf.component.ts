import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PdfMakeWrapper, Txt, Img, Cell, Table } from 'pdfmake-wrapper';
import { accesor, checkAccesorios } from  '../../formulario-kabec/formulario-kabec.component';


@Component({
  selector: 'app-crear-pdf',
  templateUrl: './crear-pdf.component.html',
  styleUrls: ['./crear-pdf.component.scss']
})
export class CrearPDFComponent implements OnInit {

  diaSemana: string;
  constructor(
    public datepipe: DatePipe = new DatePipe('en-US'),
  ) { }

  ngOnInit() {
  }

  async generarPDF(opcion: string, accesorioEquipo: any,
                   diaSemana: string, datos?: any, nombre ?: string, costo?: string, SSD?: string, datosCargador?: any, ) {
    const datosMap = datos;
    const responsable = nombre;
    const costoEquipo = this.costoFormato(costo);
    const datosAccesorioEquipo = accesorioEquipo;
    const pdf = new PdfMakeWrapper();
    const fecha = this.obtenerFecha(diaSemana);
    let discoDuroT = '';
    let valorLetra = this.costoLetra(costo);
    valorLetra = valorLetra.toUpperCase().trim();
    const discoSolido = SSD;
    // console.log(datosAccesorioEquipo);
    const datosEliminador = datosCargador;
    let ifEscritorio = false;
    if (datos.mequipo.tipo_computadora === 'ESCRITORIO') {
      ifEscritorio = true;
    } else {
      ifEscritorio = false;
    }
    function validarOtros(array) {

      if (array.length > 0 && checkAccesorios === true) {
        datosAccesorioEquipo.map(function(obj) {
          pdf.add(
            [
              new Table([// lista de caracteristicas del eliminador
                [new Cell(new Txt(obj.accProducto).fontSize(9).alignment('center').bold().relativePosition(0, 15).end).end,
                new Table([
                  [new Cell(new Txt('Marca:').fontSize(9).end).end,
                  new Cell(new Txt(obj.accMarca).fontSize(9).end).end],
                  [new Cell(new Txt('Serie:').fontSize(9).end).end,
                  new Cell(new Txt(obj.accSerie).fontSize(9).end).end],
                  [new Cell(new Txt('Modelo:').fontSize(9).end).end,
                  new Cell(new Txt(obj.accModelo).fontSize(9).end).end],
                ]).margin([-5, -3, -5, -3]).widths(['25%', '75%']).end,
                new Cell(new Txt(obj.accNom).fontSize(9).alignment('center').relativePosition(0, 15).end).end
                ],
              ]).widths(['20%', '45%', '35%']).margin([0, -1, 0, 0]).end
            ]
          );
        });
      } else {
        console.log('No hay accesorios');
      }
    }

    if (discoSolido.toString() !== '0') {
      discoDuroT = datosMap.mequipo.disco_duro + ' + ' + discoSolido + ' SSD';
    } else if (discoSolido.toString() === '0') {
      discoDuroT = datosMap.mequipo.disco_duro;
    }
    pdf.add(await new Img('../assets/img/logoPDF.png').build(),  // logo
    );
    // Fecha
    pdf.add(
      [
        new Table([
          [new Cell(new Txt('Cuidad de México a').fontSize(9).alignment('right').end).end,
          new Cell(new Txt(fecha).fontSize(9).alignment('right').end).end
          ],
        ]
        ).widths(['65%', '35%']).layout('noBorders').end,
        new Table([
          [new Cell(new Txt('fila').end).color('white').end],
          [new Cell(new Txt('fila').end).color('white').end]
        ]).layout('noBorders').end
      ]);
    // leyenda 1
    pdf.add(
      [
        new Table([
          [new Cell(new Txt('Se hace entrega de los bienes con id').fontSize(9).end).end,
          new Cell(new Txt(datosMap.mequipo.id_equipo).fontSize(9).alignment('right').end).end,
          ],
        ]).widths(['35%', '10%']).layout('noBorders').end,
        new Table([
          [new Cell(new Txt('fila').end).color('white').end],
        ]).layout('noBorders').fontSize(8).end
      ]
    );
    // Tabla con los datos del equipo
    pdf.add(
      [new Table([ // encabezado de la tabla
        [new Cell(new Txt('Bien').fontSize(9).alignment('center').color('withe').end).fillColor('#6D9EEB').end,
        new Cell(new Txt('Características').fontSize(9).alignment('center').color('withe').end).fillColor('#6D9EEB').end,
        new Cell(new Txt('ID').fontSize(9).alignment('center').color('withe').end).fillColor('#6D9EEB').end,
        ],
      ]
      ).widths(['20%', '45%', '35%']).end,
      new Table([// lista de caracterictica del equipo
        [new Cell(new Txt(datosMap.mequipo.tipo_computadora).fontSize(9).alignment('center').bold().relativePosition(0, 75).end).end,
        new Table([
          [new Cell(new Txt('Marca:').fontSize(9).end).end,
          new Cell(new Txt(datosMap.mequipo.marca).fontSize(9).end).end],
          [new Cell(new Txt('Modelo:').fontSize(9).end).end,
          new Cell(new Txt(datosMap.mequipo.modelo).fontSize(9).end).end],
          [new Cell(new Txt('Procesador:').fontSize(9).end).end,
          new Cell(new Txt(datosMap.mequipo.procesador).fontSize(9).end).end],
          [new Cell(new Txt('Sistema Operativo:').fontSize(9).end).end,
          new Cell(new Txt(datosMap.mequipo.nombre_sistema_operativo).fontSize(9).end).end],
          [new Cell(new Txt('Disco Duro:').fontSize(9).end).end,
          new Cell(new Txt(datosMap.mequipo.disco_duro).fontSize(9).end).end],
          [new Cell(new Txt('Memoria RAM:').fontSize(9).end).end,
          new Cell(new Txt(datosMap.mequipo.ram).fontSize(9).end).end],
          [new Cell(new Txt('Office:').fontSize(9).end).end,
          new Cell(new Txt('').fontSize(9).end).end],
          [new Cell(new Txt('No. Serie:').fontSize(9).end).end,
          new Cell(new Txt(datosMap.mequipo.numero_serie).fontSize(9).end).end],
          [new Cell(new Txt('Tipo de Sistema:').fontSize(9).end).end,
          new Cell(new Txt(datosMap.mequipo.tipo_sistema_operativo).fontSize(9).end).end],
        ]).margin([-5, -3, -5, -3]).widths(['25%', '75%']).end,
        new Cell(new Txt(datosMap.mequipo.id_equipo).fontSize(9).alignment('center').relativePosition(0, 75).end).end
        ],
      ]).widths(['20%', '45%', '35%']).margin([0, -1, 0, 0]).end,
    ]
    );
    if (ifEscritorio === false && datosEliminador !== null) {
      pdf.add(
        new Table([// lista de caracteristicas del eliminador
          [ new Cell( new Txt(datosEliminador.producto).fontSize(9).alignment('center').bold().relativePosition(0, 15).end ).end,
          new Table([
            [new Cell( new Txt('Marca:').fontSize(9).end ).end,
            new Cell( new Txt(datosEliminador.marca).fontSize(9).end ).end],
            [ new Cell( new Txt('Serie:').fontSize(9).end ).end,
            new Cell( new Txt(datosEliminador.serie).fontSize(9).end ).end],
            [new Cell( new Txt('Modelo:').fontSize(9).end ).end,
            new Cell( new Txt(datosEliminador.modelo).fontSize(9).end ).end],
        ]).margin([-5, -3, -5, -3] ).widths([ '25%', '75%' ]).end,
        new Cell( new Txt(datosEliminador.id_equipo).fontSize(9).alignment('center').relativePosition(0, 15).end ).end
      ],
      ]).widths([ '20%', '45%', '35%' ]).margin([0, -1, 0 , 0]).end,
      );
    } else {
      console.log('escritorio');
    }
    validarOtros(accesor);
    pdf.add(
      [
      new Table([// lista de caracteristicas para accesorios extras
        [new Cell(new Txt('Otros').fontSize(9).alignment('center').bold().relativePosition(0, 15).end).end,
        new Table([
          [new Cell(new Txt('0').fontSize(9).end).end,
          new Cell(new Txt('').fontSize(9).end).end],
          [new Cell(new Txt('').fontSize(9).end).end,
          new Cell(new Txt('0').fontSize(9).end).end],
          [new Cell(new Txt('').fontSize(9).end).end,
          new Cell(new Txt('0').fontSize(9).end).end],
        ]).margin([-5, -3, -5, -3]).widths(['25%', '75%']).color('white').end,
        new Cell(new Txt('').fontSize(9).alignment('center').relativePosition(0, 15).end).end
        ],
      ]).widths(['20%', '45%', '35%']).margin([0, -1, 0, 0]).end,
      ]
    );
    // seccion de leyendas
    pdf.add(
      [
        new Table([
          [new Cell(new Txt('fila').fontSize(8).end).color('white').end]
        ]).layout('noBorders').end,
        new Table([
          [new Cell(new Txt('El costo por desperfectos y/o composturas que presente este equipo, '
            + 'corren por la cuenta del responsable del equipo.').fontSize(9).end).end
          ]
        ]
        ).layout('noBorders').end,
        new Table([
          [new Cell(new Txt('fila').fontSize(8).end).color('white').end]
        ]).layout('noBorders').end,
        new Table([
          [new Cell(new Txt('Está estrictamente prohibido pegarle calcomanías y tocar la pantalla, '
            + 'es importante limpiar el equipo con un paño que no la raye.').fontSize(9).end).end
          ]
        ]
        ).layout('noBorders').end,
        new Table([
          [new Cell(new Txt('fila').fontSize(8).end).color('white').end]
        ]).layout('noBorders').end,
        new Table([
          [new Cell(new Txt('Éste es única y exclusivamente para cubrir las necesidades de trabajo '
            + 'requerido por los proyectos a los que el responsable sea asignado. No se permiten instalar '
            + 'Juegos, actualizaciones de Software, Música y Software sin licencia, si incurre en estos '
            + 'puntos tendrá una penalización económica.').fontSize(9).end).end
          ]
        ]
        ).layout('noBorders').end,
        new Table([
          [new Cell(new Txt('fila').fontSize(8).end).color('white').end]
        ]).layout('noBorders').end,
        new Table([
          [new Cell(new Txt('fila').fontSize(8).end).color('white').end]
        ]).layout('noBorders').end,
        new Table([
          [new Cell(new Txt('fila').fontSize(8).end).color('white').end]
        ]).layout('noBorders').end,
      ]);
    // nombre y firma del responsable
    pdf.add(
      [
        new Table([
          [new Cell(new Txt('Responsable del Equipo').fontSize(9).alignment('center').end).end,
          ],
        ]).widths(['65%']).layout('noBorders').end,
        new Table([
          [new Cell(new Txt('fila').end).color('white').end],
        ]).layout('noBorders').end,
      ]
    );
    // Leyenda del costo e imagen de datos de la empresa
    pdf.add(
      [
        new Table([
          [new Cell(new Txt('').fontSize(9).end).end,
          new Cell(new Txt('__________________________________________________').fontSize(9).alignment('center').end).end,
          ],
        ]).widths(['10%', '55%']).layout('noBorders').end,
        new Table([
          [new Cell(new Txt('').fontSize(9).end).end,
          new Cell(new Txt('C.' + responsable).end).fontSize(9).alignment('center').end],
        ]).widths(['10%', '55%']).layout('noBorders').end,
        new Table([
          [new Cell(new Txt('fila').end).color('white').fontSize(8).end],
        ]).layout('noBorders').end,
        new Table([
          [new Cell(new Txt('NOTA: EN CASO DE PÉRDIDA, ROBO Y/O INSTALACIÓN DE SOFTWARE SIN LICENCIA, '
            + 'DEL EQUIPO EL FIRMANTE TENDRÁ QUE PAGAR LA CANTIDAD DE : $' + costoEquipo + ' ' + valorLetra
            + ' PESOS 00/100 M.N.)').fontSize(9).bold().end).end],
        ]).layout('noBorders').end,
        await new Img('../assets/img/pie responsiva.png').build()
      ]
    );
        
    if (opcion === 'vista') {
      console.log("Generar");
      pdf.create().open();
    } else if (opcion === 'crear') {
      pdf.create().download(datosMap.mequipo.id_equipo + responsable.replace(' ', '') + '.pdf');
    }
  }

  obtenerFecha(nombreDia: string): string {
    const fechaSis = new Date();
    let dia = '';
    let mes: string;
    const diaNombre = nombreDia;
    /* switch (fechaSis.getUTCDay()) {
      case 2:
        dia = 'lunes'; break;
      case 3:
        dia = 'martes'; break;
      case 4:
        dia = 'miercoles'; break;
      case 5:
        dia = 'jueves'; break;
      case 6:
        dia = 'viernes'; break;
    } */
    switch (diaNombre) {
      case 'Sunday':
        dia = 'domingo'; break;
      case 'Monday':
        dia = 'lunes'; break;
      case 'Tuesday':
        dia = 'martes'; break;
      case 'Wednesday':
        dia = 'miercoles'; break;
      case 'Thursday':
        dia = 'jueves'; break;
      case 'Friday':
        dia = 'viernes'; break;
      case 'Saturday':
        dia = 'sabado'; break;
    }

    switch (fechaSis.getMonth()) {
      case 0:
        mes = 'Enero'; break;
      case 1:
        mes = 'Febrero'; break;
      case 2:
        mes = 'Marzo'; break;
      case 3:
        mes = 'Abril'; break;
      case 4:
        mes = 'Mayo'; break;
      case 5:
        mes = 'Junio'; break;
      case 6:
        mes = 'Julio'; break;
      case 7:
        mes = 'Agosto'; break;
      case 8:
        mes = 'Septiembre'; break;
      case 9:
        mes = 'Octubre'; break;
      case 10:
        mes = 'Noviembre'; break;
      case 11:
        mes = 'Diciembre'; break;
    }
    const fecha = dia + ', ' + fechaSis.getDate() + ' de ' + mes + ' de ' + fechaSis.getFullYear();
    return fecha;
  }

  costoLetra(valor: string): string {
    let numero = 0;
    let res = '';
    let cadena = '';
    let N = 1;
    const parts = this.partesValor(valor);
    const l = parts.length;
    for (let i = (l - 1); i >= 0; i--) {
      numero = Number(parts[i]);
      res = this.cientos(N, numero);
      cadena = res + cadena;
      N += 1;
    }
    return cadena;
  }

  cientos( NB: number, valor: number) {
    let mod = 0;
    let div = 0;
    mod = valor % 100;
    div = valor / 100;
    let aux1 = '';
    switch (Math.floor(div)) {
      case 0:
        aux1 = ''; break;
      case 1:
        if (mod === 0 && div === 1) {
          aux1 = 'cien';
        } else {
          aux1 = 'ciento';
        }
        break;
      case 2:
        aux1 = 'dosientos'; break;
      case 3:
        aux1 = 'trescientos'; break;
      case 4:
        aux1 = 'cuatrocientos'; break;
      case 5:
        aux1 = 'quinientos'; break;
      case 6:
        aux1 = 'seiscientos'; break;
      case 7:
        aux1 = 'setecientos'; break;
      case 8:
        aux1 = 'ochocientos'; break;
      case 9:
        aux1 = 'novecientos'; break;
    }

    let res2 = '';
    let compl = '';
    res2 = this.decenas(mod, NB);
    if (valor === 0) {
      compl = '';
    } else {
    switch (NB) {
      case 1: compl = ''; break;
      case 2: compl = 'mil '; break;
      case 3:
        if (valor === 1) {
          compl = 'millon ';
        } else {
          compl = 'millones ';
        }
        break;
      case 4: compl = 'mil millones '; break;
      case 5:
        if (valor === 1) {
          compl = 'un billon ';
        } else {
          compl = 'billones ';
        }
        break;
      case 6: compl = 'mil billones'; break;
      case 7:
        if (valor === 1) {
          compl = 'un trillon ';
        } else {
          compl = 'trillones ';
        }
        break;
      case 8: compl = 'mil trillones'; break;
    }
  }
    return aux1 + ' ' + res2 + ' ' + compl;
  }

  decenas(N1: number, nivel: number) {
    const base = N1;
    let aux1;
    let aux2;
    let aux3 = '';
    aux1 = '';
    aux2 = '';
    let mod = 0;
    let div = 0;
    mod = N1 % 10;
    div = N1 / 10;
    const aux4 = base.toString();
    if (div >= 2) {
      switch (Math.floor(div)) {
        case 2:
          aux1 = 'veinte'; break;
        case 3:
          aux1 = 'treinta'; break;
        case 4:
          aux1 = 'cuarenta'; break;
        case 5:
          aux1 = 'ciencuenta'; break;
        case 6:
          aux1 = 'sesenta'; break;
        case 7:
          aux1 = 'setenta'; break;
        case 8:
          aux1 = 'ochenta'; break;
        case 9:
          aux1 = 'noventa'; break;
      }
      switch (mod) {
        case 0:
          aux2 = '';
          return aux1;
        case 1:
          aux2 = 'uno'; break;
        case 2:
          aux2 = 'dos'; break;
        case 3:
          aux2 = 'tres'; break;
        case 4:
          aux2 = 'cuatro'; break;
        case 5:
          aux2 = 'cinco'; break;
        case 6:
          aux2 = 'seis'; break;
        case 7:
          aux2 = 'siete'; break;
        case 8:
          aux2 = 'ocho'; break;
        case 9:
          aux2 = 'nueve'; break;
      }
      aux3 = aux1 + ' y ' + aux2;
    } else {
      switch (aux4) {
        case '0':
          aux3 = ''; break;
        case '1':
          if (nivel === 2 || nivel === 4 || nivel === 6 || nivel === 8) {
            aux3 = '';
          } else {
            aux3 = 'uno';
          }
          break;
        case '2':
          aux3 = 'dos'; break;
        case '3':
          aux3 = 'tres'; break;
        case '4':
          aux3 = 'cuatro'; break;
        case '5':
          aux3 = 'cinco'; break;
        case '6':
          aux3 = 'seis'; break;
        case '7':
          aux3 = 'siete'; break;
        case '8':
          aux3 = 'ocho'; break;
        case '9':
          aux3 = 'nueve'; break;
        case '10':
          aux3 = 'diez'; break;
        case '11':
          aux3 = 'once'; break;
        case '12':
          aux3 = 'doce'; break;
        case '13':
          aux3 = 'trece'; break;
        case '14':
          aux3 = 'catorce'; break;
        case '15':
          aux3 = 'quince'; break;
        case '16':
          aux3 = 'dieciséis'; break;
        case '17':
          aux3 = 'diecisiete'; break;
        case '18':
          aux3 = 'dieciocho'; break;
        case '19':
          aux3 = 'diecinueve'; break;
      }
    }
    return aux3;
  }

  getDiaSemana() {
    this.datepipe.transform(new Date(), 'EEEE');
    console.log(this.datepipe.transform(new Date(), 'EEEE'));
    this.diaSemana = this.datepipe.transform(new Date(), 'EEEE');
  }
  partesValor(valor: any): any[] {
    valor = valor.replace(',', '');
    const lon = valor.length;
    const v1 = lon % 3;
    const v2 = lon / 3;
    let partes: any[];
    partes = [];
    switch (v1) {
      case 0:
        // console.log("caso mod = 0")
        for (let i = 0; i < v2; i++) {
          // console.log(valor.substring(i * 3, (3 * (i + 1))))
          partes[i] = valor.substring(i * 3, (3 * (i + 1)));
        }
        break;
      case 1:
        // console.log("caso mod = 1")
        for (let i = 0; i < Math.ceil(v2); i++) {
          if ( i === 0) {
            partes[i] = valor.substring(0, 1);
          } else {
            partes[i] = valor.substring((i * 3) - 2, (3 * (i + 1) - 2) );
          }
        }
        break;
      case 2:
        // console.log("caso mod = 2")
        for (let i = 0; i < Math.ceil(v2); i++) {
          if ( i === 0) {
            partes[i] = valor.substring(0, 2);
          } else {
            partes[i] = valor.substring((i * 3) - 1, (3 * (i + 1) - 1) );
          }
        }
        break;
      }
    // console.log(partes);
    return partes;
  }
  costoFormato(valor: string): string {
    const partes = this.partesValor(valor);
    let letra = '';
    for (let pos = 0; pos < partes.length; pos++) {
      if (pos === partes.length - 1) {
        letra = letra + partes[pos];
      } else {
        letra = letra + partes[pos] + ',';
      }
    }
    return letra;
  }
}
