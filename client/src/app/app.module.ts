import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./components/home/home.component";
import { CreateRoomComponent } from "./components/room/create-room/create-room.component";
import { ShowRoomComponent } from "./components/room/show-room/show-room.component";
import { HttpClientModule } from "@angular/common/http";
import { CardComponent } from './components/room/card/card.component';
import { RoomComponent } from './components/room/room.component';

@NgModule({
    declarations: [
        AppComponent,
        CreateRoomComponent,
        HomeComponent,
        ShowRoomComponent,
        CardComponent,
        RoomComponent,
    ],
    imports: [BrowserModule, AppRoutingModule, HttpClientModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
