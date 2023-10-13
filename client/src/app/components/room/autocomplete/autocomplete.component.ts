import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Menu } from "src/app/services/menu/menu.service";

@Component({
    selector: "app-autocomplete",
    templateUrl: "./autocomplete.component.html",
    styleUrls: ["./autocomplete.component.css"],
})
export class AutocompleteComponent {
    @Input() data!: Menu[];
    @Input() keyword!: string;

    selectedMenu!: string;

    constructor() {}

    @Output() selectedMenuEvent = new EventEmitter<string>();

    selectEvent(item: Menu) {
        this.selectedMenu = item.title;
        this.selectedMenuEvent.emit(this.selectedMenu);
    }

    onChangeSearch(val: string) {
        this.selectedMenu = val;
        this.selectedMenuEvent.emit(this.selectedMenu);
        // console.log("selected:", this.selectedVal);
    }
}
