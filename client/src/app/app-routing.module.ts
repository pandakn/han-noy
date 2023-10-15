import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./components/home/home.component";
import { ShowRoomComponent } from "./components/room/show-room/show-room.component";
import { FriendComponent } from "./components/room/friend/friend.component";

const routes: Routes = [
    { path: "", component: HomeComponent },
    {
        path: "room/:id",
        component: ShowRoomComponent,
        // children: [
        //     { path: "friend", component: FriendComponent },
        //     // Add more child routes for the ShowRoomComponent if needed
        // ],
    },
    { path: "room/:id/friend", component: FriendComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
