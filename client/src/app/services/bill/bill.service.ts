import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject, tap } from "rxjs";
import { environment } from "src/environments/environment.development";

@Injectable({
    providedIn: "root",
})
export class BillService {
    constructor(private http: HttpClient) {}

    apiUrl = environment.apiUrl;

    // rooms: IRoom[] = [];

    private _refreshRequired = new Subject<void>();

    get refreshRequired() {
        return this._refreshRequired;
    }

    addMenuIntoBill(billId: string, data: any) {
        return this.http.post(`${this.apiUrl}/bills/${billId}/menu`, data).pipe(
            tap(() => {
                this.refreshRequired.next();
            })
        );
    }
}
