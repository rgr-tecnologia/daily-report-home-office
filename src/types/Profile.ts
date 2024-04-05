import { Departamento } from "./Departamento";
import { Manager } from "./Manager";

export type Profile = {
  Id: number;
  Email: string;
  Title: string;
  Grupo: string;
  Departamento: Departamento;
  Gestor?: Manager;
};

export type CreateProfile = {
  Email: string;
  Title: string;
  Grupo: string;
  DepartamentoId: number;
  GestorId: number;
};

export type UpdateProfile = {
  Email: string;
  Title: string;
  Grupo: string;
  DepartamentoId: number;
  GestorId: number;
};

export type ProfileResponse = {
  Id: number;
  Email: string;
  Title: string;
  Grupo: string;
  DepartamentoId: number;
  GestorId: number;
};
