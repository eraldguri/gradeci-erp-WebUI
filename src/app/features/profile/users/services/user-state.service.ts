import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class UserStateService {
    private userSubject = new BehaviorSubject<User[]>([]);
    users$ = this.userSubject.asObservable();

    setUsers(users: User[]): void {
        this.userSubject.next(users);
    }

    addUser(user: User): void {
        const currentUsers = this.userSubject.getValue();
        this.userSubject.next([...currentUsers, user]);
    }

    updateUser(updatedUser: User): void {
        const currentUsers = this.userSubject.getValue();
        const updatedUsers = currentUsers.map(user => user.id === updatedUser.id ? updatedUser : user);
        this.userSubject.next(updatedUsers);
    }

    deleteUser(userId: string): void {
        const currentUsers = this.userSubject.getValue();
        const updatedUsers = currentUsers.filter(user => user.id !== userId);
        this.userSubject.next(updatedUsers);
    }
}