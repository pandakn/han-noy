import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IRoom } from 'src/app/interfaces/room.interface';
import { IUser } from 'src/app/interfaces/user.interface';
import { RoomService } from 'src/app/services/room/room.service';

type closeModal = {
  close: "dialog";
};

@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.css']
})
export class FriendComponent implements OnInit {
  @ViewChild("myModal") modal!: ElementRef;

  roomId: string | null = "";
  room!: IUser[];

  constructor(private roomService: RoomService,
    private route: ActivatedRoute
    ) {}

  openModal() {
    this.modal.nativeElement.showModal();
}

fetchRoomById(roomId: string | null) {
  this.roomService.getRoomById(roomId as string).subscribe({
      next: (room) => {
          this.room = room.users;
          console.log("room", this.room);
      },
  });
}

closeModal() {
  this.modal.nativeElement.close();
}

  ngOnInit(): void {
    this.roomId = this.route.snapshot.paramMap.get("id");
    this.fetchRoomById(this.roomId)
  }
}
