import { Component, Input, ViewChild } from "@angular/core";
import { IUser } from "src/app/interfaces/user.interface";
import { environment } from "src/environments/environment.development";
import { UpdatePayerComponent } from "../../bill/update-payer/update-payer.component";

@Component({
    selector: "app-menu-card",
    templateUrl: "./menu-card.component.html",
    styleUrls: ["./menu-card.component.css"],
})
export class MenuCardComponent {
    @Input() id!: string;
    @Input() billId!: string;
    @Input() title: string = "";
    @Input() price: number = 0;
    @Input() amount: number = 0;
    @Input() payers!: IUser[];
    @Input() slip!: string;
    @Input() usersInRoom!: IUser[];

    @ViewChild(UpdatePayerComponent)
    updatePayerComponent!: UpdatePayerComponent;

    imageUrl = environment.apiUrlImage;

    constructor() {}

    openModal() {
        this.updatePayerComponent.openModal();
    }
}
