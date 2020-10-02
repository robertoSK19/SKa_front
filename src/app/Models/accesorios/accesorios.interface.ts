export interface Accesorios {
    id_accesorio: string;
    nombre_accesorio: string;
    marca: string;
    modelo: string;
    producto: string;
    hecho_en: string;
    serie: string;
    costo: number;
    id_estatus: number;
    id_equipo?: number;
    descripcion?: string;
}
