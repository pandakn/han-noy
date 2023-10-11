import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject, map, tap } from "rxjs";
import { IMenu } from "src/app/interfaces/bill.interface";
import { IRoom, RoomResponse } from "src/app/interfaces/room.interface";
import { environment } from "src/environments/environment.development";

export interface Menu {
    _id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
}

@Injectable({
    providedIn: "root",
})
export class MenuService {
    constructor(private http: HttpClient) {}

    apiUrl = environment.apiUrl;

    menus: Menu[] = [];

    private _refreshRequired = new Subject<void>();

    get refreshRequired() {
        return this._refreshRequired;
    }

    getMenu(): Observable<Menu[]> {
        return this.http.get(`${this.apiUrl}/menus`).pipe(
            map((response: any) => {
                if (
                    response &&
                    response.result &&
                    Array.isArray(response.result)
                ) {
                    this.menus = response.result;
                    // console.log(response.result);

                    return this.menus;
                } else {
                    console.error("Invalid response format:", response);
                    return []; // Return an empty array in case of an invalid response format
                }
            })
        );
    }
}
