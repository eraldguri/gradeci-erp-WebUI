import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { RoleResponse } from "../../../../core/data/roles/RoleResponse";

@Injectable({
    providedIn: 'root'
})
export class RoleStateService {
    private roleSubject = new BehaviorSubject<RoleResponse[]>([]);
    roles$ = this.roleSubject.asObservable();

    setRoles(roles: RoleResponse[]): void {
        this.roleSubject.next(roles);
    }

    addRole(role: RoleResponse): void {
        const currentRoles = this.roleSubject.getValue();
        this.roleSubject.next([...currentRoles, role]);
    }

    updateRole(role: RoleResponse): void {
        const currentRoles = this.roleSubject.getValue();
        const updatedRoles = currentRoles.map(r => r.id === role.id ? role : r);
        this.roleSubject.next(updatedRoles);
    }

    deleteRole(roleId: string): void {
        const currentRoles = this.roleSubject.getValue();
        const updatedRoles = currentRoles.filter(r => r.id !== roleId);
        this.roleSubject.next(updatedRoles);
    }
}