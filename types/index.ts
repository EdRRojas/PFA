export interface Video {
  id: string;
  titulo: string;
  descripcion: string;
  url: string;
  thumbnail: string;
  categoria: string;
  duracion: string;
  fecha_creacion: string;
}

export interface ProtectedArea {
  id: string;
  nombre: string;
  tipo: string;
  descripcion: string;
  ubicacion: string;
  superficie: string;
  imagen: string;
  latitud: number;
  longitud: number;
  fecha_creacion: string;
}

export interface TeamMember {
  id: string;
  nombre: string;
  cargo: string;
  departamento: string;
  foto: string;
  biografia: string;
  orden: number;
  fecha_creacion: string;
}

export interface VolunteerFormData {
  cedula: string;
  nombre: string;
  apellido: string;
  correo: string;
  password: string;
  telefono: string;
}