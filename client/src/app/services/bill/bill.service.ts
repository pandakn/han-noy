import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject, map, tap } from "rxjs";
import { environment } from "src/environments/environment.development";

@Injectable({
    providedIn: "root",
})
export class BillService {
    constructor(private http: HttpClient) {}

    apiUrl = environment.apiUrl;

    private _refreshRequired = new Subject<void>();

    get refreshRequired() {
        return this._refreshRequired;
    }

    getBillById(billId: string) {
        return this.http.get(`${this.apiUrl}/bills/${billId}`).pipe(
            map((data: any) => {
                console.log(`bill id -> ${billId}: ${data.result}`);

                return data.result;
            })
        );
    }

    addMenuIntoBill(billId: string, data: any) {
        return this.http.post(`${this.apiUrl}/bills/${billId}/menu`, data).pipe(
            tap(() => {
                this.refreshRequired.next();
            })
        );
    }

    addPayers(billId: string, menuId: string, data: any) {
        // bills/:billId/menu/:menuId/add-payer
        return this.http
            .put(
                `${this.apiUrl}/bills/${billId}/menu/${menuId}/add-payers`,
                data
            )
            .pipe(
                tap(() => {
                    this.refreshRequired.next();
                })
            );
    }

    removePayer(billId: string, menuId: string, data: any) {
        return this.http
            .delete(
                `${this.apiUrl}/bills/${billId}/menu/${menuId}/remove-payer`,
                { body: data }
            )
            .pipe(
                tap(() => {
                    this.refreshRequired.next();
                })
            );
    }
}
