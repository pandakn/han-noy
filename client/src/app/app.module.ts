import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule } from "ngx-toastr";
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
import { AddMenuComponent } from './components/bill/add-menu/add-menu.component';
import { UpdateRoomComponent } from "./components/room/update-room/update-room.component";


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
        AddMenuComponent,
        UpdateRoomComponent
    ],
    imports: [
        CommonModule,
        BrowserAnimationsModule, // required animations module
        ToastrModule.forRoot(), // ToastrModule added
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
