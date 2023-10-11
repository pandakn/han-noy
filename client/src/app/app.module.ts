import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./components/home/home.component";
import { CreateRoomComponent } from "./components/room/create-room/create-room.component";
import { ShowRoomComponent } from "./components/room/show-room/show-room.component";
import { HttpClientModule } from "@angular/common/http";
import { CardComponent } from "./components/room/card/card.component";
import { RoomComponent } from "./components/room/room.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AutocompleteLibModule } from "angular-ng-autocomplete";
import { AutocompleteComponent } from "./components/room/autocomplete/autocomplete.component";
import { MenuCardComponent } from "./components/room/menu-card/menu-card.component";

@NgModule({
    declarations: [
        AppComponent,
        CreateRoomComponent,
        HomeComponent,
        ShowRoomComponent,
        CardComponent,
        RoomComponent,
        AutocompleteComponent,
        MenuCardComponent,
    ],
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        AutocompleteLibModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
