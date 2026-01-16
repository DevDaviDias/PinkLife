export interface StudySession {
  id: string;
  materia: string;
  comentario: string;
  inicio: number;
  fim?: number;
  duracao: number;
}
