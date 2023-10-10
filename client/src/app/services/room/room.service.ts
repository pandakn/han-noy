import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";
import { IRoom, RoomResponse } from "src/app/interfaces/room.interface";
import { environment } from "src/environments/environment.development";

@Injectable({
    providedIn: "root",
})
export class RoomService {
    constructor(private http: HttpClient) {}

    apiUrl = environment.apiUrl;

    rooms: IRoom[] = [];

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
}
