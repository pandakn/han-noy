import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { IMenu } from "src/app/interfaces/bill.interface";
import { IUser } from "src/app/interfaces/user.interface";
import { FriendService, User } from "src/app/services/friend/friend.service";
import { RoomService } from "src/app/services/room/room.service";

@Component({
    selector: "app-friend",
    templateUrl: "./friend.component.html",
    styleUrls: ["./friend.component.css"],
})
export class FriendComponent implements OnInit {
    @ViewChild("myModal") modal!: ElementRef;
    @Input() isDisable!: boolean;

    roomId: string | null = "";
    room!: IUser[];

    // for autocomplete
    friends!: User[];
    keyword = "name";

    menusInBill!: IMenu[];
    selectedFriend!: string;
    usersInRoom!: IUser[];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private roomService: RoomService,
        private friendService: FriendService,
        private toastr: ToastrService
    ) {}

    ngOnInit(): void {
        this.roomId = this.route.snapshot.paramMap.get("id");
        this.fetchRoomById(this.roomId);
        this.fetchFriends();
    }

    fetchRoomById(roomId: string | null) {
        this.roomService.getRoomById(roomId as string).subscribe({
            next: (room) => {
                this.room = room.users;
                console.log("room", this.room);
            },
        });
    }

    fetchFriends() {
        this.friendService.getUsers().subscribe({
            next: (users) => {
                this.friends = users;
                console.log("friends", this.friends);
            },
        });
    }

    addFriendIntoRoom() {
        const timeOut = 2000;
        const toastTitle = "Add Friend";
        const data = {
            userName: this.selectedFriend,
        };

        if (!data.userName) {
            this.toastr.error("ใส่ชื่อเพื่อนด้วยค่าาาา", toastTitle, {
                timeOut,
            });
            return;
        }

        this.roomId &&
            this.friendService.addUserIntoRoom(this.roomId, data).subscribe({
                next: (response) => {
                    console.log("Success data:", response);

                    this.toastr.success(
                        "Add friend into Room Successfully",
                        toastTitle,
                        {
                            timeOut,
                        }
                    );

                    setTimeout(() => {
                        window.location.reload();
                    }, timeOut);
                },
                error: (error) => {
                    console.error("Error:", error);
                    if (error.error.message === "User is already in the room") {
                        this.toastr.error(
                            "แหกตาด้วยค่าาาา มีเพื่อนในห้องแล้วเนาะ",
                            toastTitle,
                            {
                                timeOut: 3000,
                            }
                        );
                        return;
                    }
                    this.toastr.error(error.error.message, toastTitle, {
                        timeOut,
                    });
                },
            });
    }

    removeFriendFromRoom(payerId: string) {
        const timeOut = 1000;

        this.roomId &&
            this.friendService
                .removeUserFromRoom(this.roomId, payerId)
                .subscribe({
                    next: () => {
                        this.toastr.success(
                            "Add friend into Room Successfully",
                            "Remove Friend",
                            {
                                timeOut,
                            }
                        );

                        setTimeout(() => {
                            window.location.reload();
                        }, timeOut);
                    },
                });
    }

    goBackToMenu() {
        // Replace ':id' with the actual ID you want to navigate to
        this.router.navigate([`/room/${this.roomId}`]);
    }

    openModal() {
        this.modal.nativeElement.showModal();
    }

    closeModal() {
        this.modal.nativeElement.close();
    }

    receiveSelectedFriend(value: string) {
        this.selectedFriend = value;
        // console.log("friend name:", value);
    }
}
