import { Component, OnInit, ElementRef, ViewChild, Input } from "@angular/core";
import { IRoom } from "src/app/interfaces/room.interface";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { RoomPayload, RoomService } from "src/app/services/room/room.service";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: "app-update-room",
    templateUrl: "./update-room.component.html",
    styleUrls: ["./update-room.component.css"],
})
export class UpdateRoomComponent implements OnInit {
    @Input() roomId: string | null = "";
    @ViewChild("myModal") modal!: ElementRef;

    updateRoom = new FormGroup({
        name: new FormControl("", Validators.required),
        bio: new FormControl(""),
        promptPay: new FormControl("", [
            Validators.pattern(/^\d{10}$/),
            Validators.required,
        ]),
    });

    openModal() {
        this.modal.nativeElement.showModal();
    }

    closeModal() {
        this.modal.nativeElement.close();
    }

    rooms: IRoom[] = [];

    constructor(
        private roomService: RoomService,
        private toastr: ToastrService
    ) {}
    ngOnInit(): void {
        this.fetchRoomById(this.roomId);
    }

    fetchRoomById(roomId: string | null) {
        if (roomId) {
            this.roomService.getRoomById(roomId).subscribe({
                next: (room) => {
                    this.populateForm(room); // Set default values based on the fetched room
                },
                error: (error) => {
                    console.error("Error fetching room:", error);
                },
            });
        }
    }

    handleUpdateRoom() {
        if (this.updateRoom.valid) {
            if (this.roomId) {
                const data: RoomPayload = {
                    name: this.updateRoom.value.name || "",
                    bio: this.updateRoom.value.bio || "",
                    promptPay: this.updateRoom.value.promptPay || "",
                };

                this.roomService.updateRoomById(data, this.roomId).subscribe({
                    next: (response) => {
                        console.log("Success data:", response);

                        this.toastr.success(
                            "Updated Room Successfully",
                            "Updated",
                            {
                                timeOut: 3000,
                            }
                        );

                        this.closeModal();
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    },
                    error: (error) => {
                        console.error("Error:", error);
                    },
                });
            }
        }
    }

    private populateForm(room: IRoom): void {
        const qrCode = room.qrCode;
        const promptPay = this.extractNumberFromQRCode(qrCode);

        this.updateRoom.patchValue({
            name: room.name,
            bio: room.bio,
            promptPay: promptPay, // Assuming qrCode is the appropriate field for promptPay
        });
    }

    private extractNumberFromQRCode(qrCode: string): string {
        // Check if the qrCode starts with the expected URL
        const url = "https://promptpay.io/";
        if (qrCode.startsWith(url)) {
            // Extract the number from the qrCode
            return qrCode.slice(url.length);
        }

        // If the qrCode doesn't match the expected format, return an empty string
        return "";
    }

    onCancleClick() {

    }
}
