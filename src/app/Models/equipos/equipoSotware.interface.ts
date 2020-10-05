import { Software } from '../Software/software.interface';
import { Equipos } from './equipos.interface';

export interface EquipoSoftware {
    id_equipo: Equipos;
    id_software: Software;
}
