import { Component, Input } from "@angular/core";
import { RoomService } from "src/app/services/room/room.service";

@Component({
    selector: "app-card",
    templateUrl: "./card.component.html",
    styleUrls: ["./card.component.css"],
})
export class CardComponent {
    // receive props from parent
    @Input() id: string = "";
    @Input() name: string = "";
    @Input() bio: string = "";
    @Input() qrCode: string = "";

    // () => <return type>
    // in bracket is params
    constructor(private roomService: RoomService) {}

    handleDeleteRoom(roomId: string) {
        console.log(`clicked id : ${roomId}`);

        this.roomService.deleteRoomById(roomId).subscribe({
            next: (response) => {
                console.log("Room deleted successfully:", response);
                // Optionally, you can perform additional actions here.
                window.location.reload();
            },
            error: (error) => {
                console.error("Error deleting room:", error);
            },
        });
    }
}
