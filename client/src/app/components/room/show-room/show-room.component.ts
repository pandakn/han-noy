import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { IRoom } from "src/app/interfaces/room.interface";
import { RoomService } from "src/app/services/room/room.service";

@Component({
    selector: "app-show-room",
    templateUrl: "./show-room.component.html",
    styleUrls: ["./show-room.component.css"],
})
export class ShowRoomComponent {
    roomId: string | null = "";
    room!: IRoom;

    constructor(
        private route: ActivatedRoute,
        private roomService: RoomService
    ) {}

    ngOnInit() {
        this.roomId = this.route.snapshot.paramMap.get("id");
        this.fetchRoomById(this.roomId);
    }

    fetchRoomById(roomId: string | null) {
        this.roomService.getRoomById(roomId as string).subscribe({
            next: (room) => {
                this.room = room;
                console.log("rooms", this.room);
            },
        });
    }
}
