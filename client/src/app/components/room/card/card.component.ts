import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { RoomService } from "src/app/services/room/room.service";

@Component({
    selector: "app-card",
    templateUrl: "./card.component.html",
    styleUrls: ["./card.component.css"],
})
export class CardComponent {
    @ViewChild("deleteModal") modal!: ElementRef;
    // receive props from parent
    @Input() id: string = "";
    @Input() name: string = "";
    @Input() bio: string = "";
    @Input() qrCode: string = "";

    // () => <return type>
    // in bracket is params
    constructor(
        private roomService: RoomService,
        private toastr: ToastrService
    ) {}
    openModal() {
        this.modal.nativeElement.showModal();
    }

    closeModal() {
        this.modal.nativeElement.close();
    }

    handleDeleteRoom(roomId: string) {
        console.log(`clicked id : ${roomId}`);

        this.roomService.deleteRoomById(roomId).subscribe({
            next: (response) => {
                console.log("Room deleted successfully:", response);
                this.toastr.success("Deleted Room Successfully", "Updated", {
                    timeOut: 3000,
                });

                // this.closeModal();
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            },
            error: (error) => {
                console.error("Error deleting room:", error);
            },
        });
    }
}
