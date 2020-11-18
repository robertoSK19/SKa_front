export interface Asignacion {
    id_asignacion: string;
    nombre_consultor: string;
    fecha_asignacion: string;
    costo: number;
    letra: string;
    id_dequipo: number;
    id_estatus: number;
    usuario: string;
    comentario?: string;
}
