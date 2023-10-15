import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject, map, tap } from "rxjs";
import { environment } from "src/environments/environment.development";

export interface User {
    _id: string;
    name: string;
    avatar: string;
    createdAt: string;
    updatedAt: string;
}

@Injectable({
    providedIn: "root",
})
export class FriendService {
    constructor(private http: HttpClient) {}

    apiUrl = environment.apiUrl;

    friends: User[] = [];

    private _refreshRequired = new Subject<void>();

    get refreshRequired() {
        return this._refreshRequired;
    }

    getUsers(): Observable<User[]> {
        return this.http.get(`${this.apiUrl}/users`).pipe(
            map((response: any) => {
                if (
                    response &&
                    response.result &&
                    Array.isArray(response.result)
                ) {
                    this.friends = response.result;
                    // console.log(response.result);

                    return this.friends;
                } else {
                    console.error("Invalid response format:", response);
                    return []; // Return an empty array in case of an invalid response format
                }
            })
        );
    }

    addUserIntoRoom(roomId: string, data: any) {
        return this.http.post(`${this.apiUrl}/rooms/${roomId}/user`, data).pipe(
            tap(() => {
                this.refreshRequired.next();
            })
        );
    }

    removeUserFromRoom(roomId: string, userId: string) {
        return this.http
            .delete(`${this.apiUrl}/rooms/${roomId}/user/${userId}`)
            .pipe(
                tap(() => {
                    this.refreshRequired.next();
                })
            );
    }
}
