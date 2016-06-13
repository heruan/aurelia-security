import { SecurityRole } from "./security-role";
export interface Principal {
    name: string;
    roles: SecurityRole[];
}
