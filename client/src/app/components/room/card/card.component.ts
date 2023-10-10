import { Component, Input } from "@angular/core";

@Component({
    selector: "app-card",
    templateUrl: "./card.component.html",
    styleUrls: ["./card.component.css"],
})
export class CardComponent {
    // receive props from parent
    @Input() id: string = "";
    @Input() name: string = "";
    @Input() bio: string = "";
    @Input() qrCode: string = "";

    // () => <return type>
    // in bracket is params
    constructor() {}
}
