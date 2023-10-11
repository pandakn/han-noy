import { Component, Input } from "@angular/core";
import { Menu } from "src/app/services/menu/menu.service";

@Component({
    selector: "app-autocomplete",
    templateUrl: "./autocomplete.component.html",
    styleUrls: ["./autocomplete.component.css"],
})
export class AutocompleteComponent {
    @Input() data!: Menu[];
    @Input() keyword!: string;

    selectedVal = "";

    constructor() {}

    selectEvent(item: Menu) {
        // do something with selected item
        // console.log(item);
        this.selectedVal = item.title;
        console.log("selected:", this.selectedVal);
    }

    onChangeSearch(val: string) {
        // console.log(val);
        this.selectedVal = val;
        console.log("selected:", this.selectedVal);
    }
}
