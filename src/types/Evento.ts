export type Evento = {
  id: string;
  date: string;
  title: string;
  time: string;
  status: number;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
};