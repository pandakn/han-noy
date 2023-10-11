import { Component, Input } from "@angular/core";

@Component({
    selector: "app-menu-card",
    templateUrl: "./menu-card.component.html",
    styleUrls: ["./menu-card.component.css"],
})
export class MenuCardComponent {
    @Input() title: string = "";
    @Input() price: number = 0;
    @Input() amount: number = 0;
    @Input() payers: any;

    constructor() {}
}
