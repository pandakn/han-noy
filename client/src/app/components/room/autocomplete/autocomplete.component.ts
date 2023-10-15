import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Menu } from "src/app/services/menu/menu.service";

@Component({
    selector: "app-autocomplete",
    templateUrl: "./autocomplete.component.html",
    styleUrls: ["./autocomplete.component.css"],
})
export class AutocompleteComponent {
    @Input() data: any = [];
    @Input() keyword!: string;
    @Input() placeholder!: string;

    selectedValue!: string;

    constructor() {}

    @Output() selectedValueEvent = new EventEmitter<string>();

    selectEvent(item: any) {
        this.selectedValue = item[this.keyword];
        this.selectedValueEvent.emit(this.selectedValue);
    }

    onChangeSearch(val: string) {
        this.selectedValue = val;
        this.selectedValueEvent.emit(this.selectedValue);
    }
}
