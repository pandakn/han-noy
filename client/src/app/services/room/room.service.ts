import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject, map, tap } from "rxjs";
import { IRoom, RoomResponse } from "src/app/interfaces/room.interface";
import { environment } from "src/environments/environment.development";

export interface RoomPayload {
    name: string;
    bio: string;
    promptPay: string;
}

@Injectable({
    providedIn: "root",
})
export class RoomService {
    constructor(private http: HttpClient) {}

    apiUrl = environment.apiUrl;

    rooms: IRoom[] = [];

    private _refreshRequired = new Subject<void>();

    get refreshRequired() {
        return this._refreshRequired;
    }

    addRoom(roomData: any) {
        return this.http.post(`${this.apiUrl}/rooms`, roomData).pipe(
            tap(() => {
                this.refreshRequired.next();
            })
        );
    }

    getRooms(): Observable<IRoom[]> {
        return this.http.get<RoomResponse>(`${this.apiUrl}/rooms`).pipe(
            map((response: RoomResponse) => {
                if (
                    response &&
                    response.result &&
                    Array.isArray(response.result)
                ) {
                    this.rooms = response.result;
                    // console.log(response.result);

                    return this.rooms;
                } else {
                    console.error("Invalid response format:", response);
                    return []; // Return an empty array in case of an invalid response format
                }
            })
        );
    }

    getRoomById(roomId: string) {
        return this.http.get<any>(`${this.apiUrl}/rooms/${roomId}`).pipe(
            map((data) => {
                return data.result;
            })
        );
    }

    deleteRoomById(roomId: string) {
        return this.http.delete(`${this.apiUrl}/rooms/${roomId}`);
    }
}
