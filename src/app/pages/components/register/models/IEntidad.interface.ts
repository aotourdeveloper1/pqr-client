export interface IEntidad {
  id: number;
  codigo: string;
  nombre: string;
  activa: boolean;
}

export const entidad: IEntidad[] = [
  {
    id: 1,
    codigo: 'BARR',
    nombre: 'Barranquilla',
    activa: true,
  },
  {
    id: 2,
    codigo: 'BOGT',
    nombre: 'Bogota',
    activa: true,
  },
  {
    id: 3,
    codigo: 'OTRO',
    nombre: 'Otros',
    activa: true,
  },
];
