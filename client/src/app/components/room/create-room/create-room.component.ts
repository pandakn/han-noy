import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { RoomPayload, RoomService } from "src/app/services/room/room.service";

type closeModal = {
    close: "dialog";
};

@Component({
    selector: "app-create-room",
    templateUrl: "./create-room.component.html",
    styleUrls: ["./create-room.component.css"],
})
export class CreateRoomComponent {
    constructor(private roomService: RoomService) {}

    roomForm = new FormGroup({
        name: new FormControl("", Validators.required), // Add validation if needed
        bio: new FormControl(""),
        promptPay: new FormControl("", Validators.pattern(/^\d{10}$/)), // Validate for 10-13 characters
    });

    onSubmitForm() {
        if (this.roomForm.valid) {
            const data: RoomPayload = {
                name: this.roomForm.value.name || "",
                bio: this.roomForm.value.bio || "",
                promptPay: this.roomForm.value.promptPay || "",
            };

            this.roomService.addRoom(data).subscribe({
                next: (response) => {
                    console.log("Success data:", response);
                    // alert("Create room successfully🎉");
                    this.roomForm.reset();
                    // window.location.reload();
                },
                error: (error) => {
                    console.error("Error:", error);
                },
            });
        }
    }
}
