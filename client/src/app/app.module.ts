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
import { MatTabsModule } from "@angular/material/tabs";
import { HttpClientModule } from "@angular/common/http";
import { CardComponent } from "./components/room/card/card.component";
import { RoomComponent } from "./components/room/room.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AutocompleteLibModule } from "angular-ng-autocomplete";
import { AutocompleteComponent } from "./components/room/autocomplete/autocomplete.component";
import { MenuCardComponent } from "./components/room/menu-card/menu-card.component";
import { AddMenuComponent } from "./components/bill/add-menu/add-menu.component";
import { UpdateRoomComponent } from "./components/room/update-room/update-room.component";
import { FilterPipe } from "./filter/filter.pipe";
import { SearchBarComponent } from "./components/search-bar/search-bar.component";
import { FriendComponent } from "./components/room/friend/friend.component";
import { ShowQrcodeComponent } from "./components/room/show-qrcode/show-qrcode.component";
import { UpdatePayerComponent } from "./components/bill/update-payer/update-payer.component";
import { BillMenuComponent } from './components/room/bill-menu/bill-menu.component';

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
        UpdateRoomComponent,
        FilterPipe,
        SearchBarComponent,
        FriendComponent,
        ShowQrcodeComponent,
        UpdatePayerComponent,
        BillMenuComponent,
    ],
    imports: [
        CommonModule,
        BrowserAnimationsModule, // required animations module
        ToastrModule.forRoot(), // ToastrModule added
        BrowserModule,
        ReactiveFormsModule,
        MatTabsModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        AutocompleteLibModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
