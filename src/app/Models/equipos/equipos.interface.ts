export interface Equipos {
    id_equipo: string ;
    nombre_equipo: string;
    marca: string;
    modelo: string;
    modelo_equipo_cmd: string;
    numero_serie: string;
    numero_serie_cmd: string;
    procesador: string;
    ram: number;
    disco_duro: string;
    cuenta_usuario: string;
    cuenta_usuario_contraseña: string;
    tipo_computadora: string;
    fecha_fabricacion: string;
    nombre_sistema_operativo: string;
    tipo_sistema_operativo: string;
    direccion_mac: string;
    email_gnp: string;
    tipo_disco_duro: string;
    generacion_procesador: string;
    tamaño_pantalla: string;
    fecha_compra: string;
    lugar_compra: string;
    fecha_garantia_termino: string;
    id_historico_equipo?: number;
    id_equipo_software?: number;
}
