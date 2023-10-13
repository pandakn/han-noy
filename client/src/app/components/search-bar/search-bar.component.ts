import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: "app-search-bar",
    templateUrl: "./search-bar.component.html",
    styleUrls: ["./search-bar.component.css"],
})
export class SearchBarComponent {
    @Input() searchText = "";
    @Output() searchTextChange = new EventEmitter<string>();

    constructor() {}

    onSearchTextChange(newValue: string) {
        this.searchText = newValue;
        this.searchTextChange.emit(newValue);
    }
}
