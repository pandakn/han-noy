import { Component, OnInit } from "@angular/core";
import { IRoom } from "src/app/interfaces/room.interface";
import { RoomService } from "src/app/services/room/room.service";

@Component({
    selector: "app-room",
    templateUrl: "./room.component.html",
    styleUrls: ["./room.component.css"],
})
export class RoomComponent implements OnInit {
    rooms: IRoom[] = [];
    constructor(private roomService: RoomService) {}

    ngOnInit(): void {
        this.fetchRooms();
        this.roomService.refreshRequired.subscribe(() => {
            this.fetchRooms();
        });
    }

    fetchRooms() {
        this.roomService.getRooms().subscribe({
            next: (rooms) => {
                this.rooms = rooms;
                console.log("rooms", this.rooms);
            },
        });
    }
}
