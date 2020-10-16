import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { PdfMakeWrapper, Txt, Img, Cell, Table } from 'pdfmake-wrapper';
import { accesoriosID } from '../../agregar-responsivas/agregar-responsivas.component';

let responsable = "";

@Component({
  selector: 'app-pdf-kabec-accesorios',
  templateUrl: './pdf-kabec-accesorios.component.html',
  styleUrls: ['./pdf-kabec-accesorios.component.scss']
})
export class PdfKabecAccesoriosComponent implements OnInit {
  
  diaSemana: string;
  constructor(
    public datepipe: DatePipe = new DatePipe('en-US')
  ) { }

  ngOnInit() {
  }

  async generarPDF(accion: string, accesorios: any, diaSemana: string, datos?: any, costo: number = 0) {
    console.log(datos);
    console.log(accesorios);
    const opcion = accion;
    const pdf = new PdfMakeWrapper();
    const fecha = this.obtenerFecha(diaSemana);
    const valorLetra = this.NumeroALetras(costo);
    const costoEquipo = costo;

    datos.map(function(obj){
      responsable = obj.nombre_consultor;
    })

    function agregaAccesorios(array) {
      if (array.length > 0) {
        let valores = array.length;
        let nombre = "";
        array.map(function (obj) {
          if (valores > 1) {
            nombre = nombre + ' ' + obj.nombres;
          } else {
            nombre = obj.nombres;
          }
        })
        pdf.add(
          [
            new Table([
              [new Cell(new Txt('Se hace entrega de los bienes con id').fontSize(9).end).end,
              new Cell(new Txt(nombre).fontSize(9).alignment('right').end).end,
              ],
            ]).widths(['35%', '10%']).layout('noBorders').end,
            new Table([
              [new Cell(new Txt('fila').end).color('white').end],
            ]).layout('noBorders').end
          ]
        );
      }
    }

    function valoresAccesorios(array) {
      if (array.length > 0) {
        array.map(function (obj) {
          if (obj.producto === "RAM") {
            pdf.add(
              new Table([
                [new Cell(new Txt(obj.producto).fontSize(9).alignment('center').bold().relativePosition(0, 45).end).end,
                new Table([
                  [new Cell(new Txt('Marca:').fontSize(9).end).end,
                  new Cell(new Txt(obj.marca).fontSize(9).end).end],
                  [new Cell(new Txt('Modelo:').fontSize(9).end).end,
                  new Cell(new Txt(obj.modelo).fontSize(9).end).end],
                  [new Cell(new Txt('Ranura:').fontSize(9).end).end,
                  new Cell(new Txt(obj.ranura).fontSize(9).end).end],
                  [new Cell(new Txt('Bus:').fontSize(9).end).end,
                  new Cell(new Txt(obj.bus).fontSize(9).end).end],
                  [new Cell(new Txt('Capacidad:').fontSize(9).end).end,
                  new Cell(new Txt(obj.capacidad).fontSize(9).end).end],
                  [new Cell(new Txt('No. Serie:').fontSize(9).end).end,
                  new Cell(new Txt(obj.serie).fontSize(9).end).end],
                ]).margin([-5, -3, -5, -3]).widths(['25%', '75%']).end,
                new Cell(new Txt(obj.nombres).fontSize(9).alignment('center').relativePosition(0, 45).end).end
                ],
              ]).widths(['20%', '45%', '35%']).margin([0, -1, 0, 0]).end,
            );
          } else if (obj.producto === "Disco Duro") {
            pdf.add(
              new Table([
                [new Cell(new Txt(obj.producto).fontSize(9).alignment('center').bold().relativePosition(0, 45).end).end,
                new Table([
                  [new Cell(new Txt('Marca:').fontSize(9).end).end,
                  new Cell(new Txt(obj.marca).fontSize(9).end).end],
                  [new Cell(new Txt('Modelo:').fontSize(9).end).end,
                  new Cell(new Txt(obj.modelo).fontSize(9).end).end],
                  [new Cell(new Txt('Tipo de Disco:').fontSize(9).end).end,
                  new Cell(new Txt(obj.tipo_disco).fontSize(9).end).end],
                  [new Cell(new Txt('Capacidad:').fontSize(9).end).end,
                  new Cell(new Txt(obj.capacidad).fontSize(9).end).end],
                  [new Cell(new Txt('No. Serie:').fontSize(9).end).end,
                  new Cell(new Txt(obj.serie).fontSize(9).end).end],
                ]).margin([-5, -3, -5, -3]).widths(['25%', '75%']).end,
                new Cell(new Txt(obj.nombres).fontSize(9).alignment('center').relativePosition(0, 45).end).end
                ],
              ]).widths(['20%', '45%', '35%']).margin([0, -1, 0, 0]).end,
            );
          } else {
            pdf.add(
              new Table([
                [new Cell(new Txt(obj.producto).fontSize(9).alignment('center').bold().relativePosition(0, 15).end).end,
                new Table([
                  [new Cell(new Txt('Marca:').fontSize(9).end).end,
                  new Cell(new Txt(obj.marca).fontSize(9).end).end],
                  [new Cell(new Txt('Modelo:').fontSize(9).end).end,
                  new Cell(new Txt(obj.modelo).fontSize(9).end).end],
                  [new Cell(new Txt('No. Serie:').fontSize(9).end).end,
                  new Cell(new Txt(obj.serie).fontSize(9).end).end],
                ]).margin([-5, -3, -5, -3]).widths(['25%', '75%']).end,
                new Cell(new Txt(obj.nombres).fontSize(9).alignment('center').relativePosition(0, 15).end).end
                ],
              ]).widths(['20%', '45%', '35%']).margin([0, -1, 0, 0]).end,
            );
          }
        })
      }
    }

    pdf.add(await new Img('../assets/img/logoPDF.png').build(),
    );
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

    agregaAccesorios(accesoriosID);

    pdf.add(
      [new Table([ // encabezado de la tabla
        [new Cell(new Txt('Bien').fontSize(9).alignment('center').color('withe').end).fillColor('#6D9EEB').end,
        new Cell(new Txt('Características').fontSize(9).alignment('center').color('withe').end).fillColor('#6D9EEB').end,
        new Cell(new Txt('ID').fontSize(9).alignment('center').color('withe').end).fillColor('#6D9EEB').end,
        ],
      ]
      ).widths(['20%', '45%', '35%']).end]);

    valoresAccesorios(accesoriosID);

    // seccion de leyendas
    pdf.add(
      [
        new Table([
          [new Cell(new Txt('fila').fontSize(9).end).color('white').end]
        ]).layout('noBorders').end,
        new Table([
          [new Cell(new Txt('El costo por desperfectos y/o composturas que presente este equipo, '
            + 'corren por la cuenta del responsable del equipo.').fontSize(9).end).end
          ]
        ]
        ).layout('noBorders').end,
        new Table([
          [new Cell(new Txt('fila').fontSize(9).end).color('white').end]
        ]).layout('noBorders').end,
        new Table([
          [new Cell(new Txt('Está estrictamente prohibido pegarle calcomanías y tocar la pantalla, '
            + 'es importante limpiar el equipo con un paño que no la raye.').fontSize(9).end).end
          ]
        ]
        ).layout('noBorders').end,
        new Table([
          [new Cell(new Txt('fila').fontSize(9).end).color('white').end]
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
          [new Cell(new Txt('fila').fontSize(9).end).color('white').end]
        ]).layout('noBorders').end,
        new Table([
          [new Cell(new Txt('fila').fontSize(9).end).color('white').end]
        ]).layout('noBorders').end,
        new Table([
          [new Cell(new Txt('fila').fontSize(9).end).color('white').end]
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
          [new Cell(new Txt('fila').end).color('white').end],
        ]).layout('noBorders').end,
        new Table([
          [new Cell(new Txt('NOTA: EN CASO DE PÉRDIDA, ROBO Y/O INSTALACIÓN DE SOFTWARE SIN LICENCIA, '
            + 'DEL EQUIPO EL FIRMANTE TENDRÁ QUE PAGAR LA CANTIDAD DE : $' + costoEquipo + ' ' + valorLetra).fontSize(9).bold().end).end],
        ]).layout('noBorders').end,
        await new Img('../assets/img/pie responsiva.png').build()
      ]
    );

    ///////////GENERAR VISTA PREVIA Y DESCARGA DE PDF//////////
    if (opcion === 'vista') {
      pdf.create().open();
    } else if (opcion === 'crear') {
      console.log("Di click en generar");
      pdf.create().download("Accesorio_"+ responsable.replace(' ', '') + '.pdf');
    }
  }

  obtenerFecha(nombreDia: string): string {
    const fechaSis = new Date();
    let dia = '';
    let mes: string;
    const diaNombre = nombreDia;
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

  Unidades(num: number) {

    switch (num) {
      case 1: return "UN";
      case 2: return "DOS";
      case 3: return "TRES";
      case 4: return "CUATRO";
      case 5: return "CINCO";
      case 6: return "SEIS";
      case 7: return "SIETE";
      case 8: return "OCHO";
      case 9: return "NUEVE";
    }

    return "";
  }

  Decenas(num: number) {

    let decena = Math.floor(num / 10);
    let unidad = num - (decena * 10);

    switch (decena) {
      case 1:
        switch (unidad) {
          case 0: return "DIEZ";
          case 1: return "ONCE";
          case 2: return "DOCE";
          case 3: return "TRECE";
          case 4: return "CATORCE";
          case 5: return "QUINCE";
          default: return "DIECI" + this.Unidades(unidad);
        }
      case 2:
        switch (unidad) {
          case 0: return "VEINTE";
          default: return "VEINTI" + this.Unidades(unidad);
        }
      case 3: return this.DecenasY("TREINTA", unidad);
      case 4: return this.DecenasY("CUARENTA", unidad);
      case 5: return this.DecenasY("CINCUENTA", unidad);
      case 6: return this.DecenasY("SESENTA", unidad);
      case 7: return this.DecenasY("SETENTA", unidad);
      case 8: return this.DecenasY("OCHENTA", unidad);
      case 9: return this.DecenasY("NOVENTA", unidad);
      case 0: return this.Unidades(unidad);
    }
  }

  DecenasY(strSin, numUnidades) {
    if (numUnidades > 0)
      return strSin + " Y " + this.Unidades(numUnidades)

    return strSin;
  }

  Centenas(num) {

    let centenas = Math.floor(num / 100);
    let decenas = num - (centenas * 100);

    switch (centenas) {
      case 1:
        if (decenas > 0)
          return "CIENTO " + this.Decenas(decenas);
        return "CIEN";
      case 2: return "DOSCIENTOS " + this.Decenas(decenas);
      case 3: return "TRESCIENTOS " + this.Decenas(decenas);
      case 4: return "CUATROCIENTOS " + this.Decenas(decenas);
      case 5: return "QUINIENTOS " + this.Decenas(decenas);
      case 6: return "SEISCIENTOS " + this.Decenas(decenas);
      case 7: return "SETECIENTOS " + this.Decenas(decenas);
      case 8: return "OCHOCIENTOS " + this.Decenas(decenas);
      case 9: return "NOVECIENTOS " + this.Decenas(decenas);
    }

    return this.Decenas(decenas);
  }

  Seccion(num, divisor, strSingular, strPlural) {
    let cientos = Math.floor(num / divisor)
    let resto = num - (cientos * divisor)

    let letras = "";

    if (cientos > 0)
      if (cientos > 1)
        letras = this.Centenas(cientos) + " " + strPlural;
      else
        letras = strSingular;

    if (resto > 0)
      letras += "";

    return letras;
  }

  Miles(num) {
    let divisor = 1000;
    let cientos = Math.floor(num / divisor)
    let resto = num - (cientos * divisor)

    let strMiles = this.Seccion(num, divisor, "MIL", "MIL");
    let strCentenas = this.Centenas(resto);

    if (strMiles == "")
      return strCentenas;

    return strMiles + " " + strCentenas;
  }

  Millones(num) {
    let divisor = 1000000;
    let cientos = Math.floor(num / divisor)
    let resto = num - (cientos * divisor)

    let strMillones = this.Seccion(num, divisor, "UN MILLON", "MILLONES");
    let strMiles = this.Miles(resto);

    if (strMillones == "")
      return strMiles;

    return strMillones + " " + strMiles;
  }

  NumeroALetras(num) {
    var data = {
      numero: num,
      enteros: Math.floor(num),
      centavos: (((Math.round(num * 100)) - (Math.floor(num) * 100))),
      letrasCentavos: "",
      letrasMonedaPlural: "PESOS",
      letrasMonedaSingular: "PESO"
    };

    if (data.centavos > 0)
      data.letrasCentavos = "CON " + data.centavos + "/100";

    if (data.enteros == 0)
      return "CERO " + data.letrasMonedaPlural + " " + data.letrasCentavos;
    if (data.enteros == 1)
      return this.Millones(data.enteros) + " " + data.letrasMonedaSingular + " " + "00/100 M.N.";
    else
      return this.Millones(data.enteros) + " " + data.letrasMonedaPlural + " " + "00/100 M.N.";
  }

  getDiaSemana() {
    this.datepipe.transform(new Date(), 'EEEE');
    console.log(this.datepipe.transform(new Date(), 'EEEE'));
    this.diaSemana = this.datepipe.transform(new Date(), 'EEEE');
  }

}
