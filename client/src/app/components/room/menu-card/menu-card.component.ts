import { Component, Input } from "@angular/core";
import { IUser } from "src/app/interfaces/user.interface";
import { environment } from "src/environments/environment.development";

@Component({
    selector: "app-menu-card",
    templateUrl: "./menu-card.component.html",
    styleUrls: ["./menu-card.component.css"],
})
export class MenuCardComponent {
    @Input() title: string = "";
    @Input() price: number = 0;
    @Input() amount: number = 0;
    @Input() payers!: IUser[];
    @Input() slip!: string;

    imageUrl = environment.apiUrlImage;

    constructor() {}
}
