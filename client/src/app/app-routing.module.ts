import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./components/home/home.component";
import { ShowRoomComponent } from "./components/room/show-room/show-room.component";

const routes: Routes = [
    { path: "", component: HomeComponent },
    { path: "room/:id", component: ShowRoomComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
