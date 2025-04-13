import { UserDTO } from "./UserDTO";

export enum SolicitationStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELED = "CANCELED",
  DONE = "DONE",
}

export type Schedule = {
  id: string;
  tenantId: string;
  procedure: string;
  date: string; 
  time: string; 
  status: SolicitationStatus;
  user: UserDTO;
};
