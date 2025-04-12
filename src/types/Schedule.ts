import { UserDTO } from "./userDTO";

export enum SolicitationStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
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
