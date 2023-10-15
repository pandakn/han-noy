import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IRoom } from 'src/app/interfaces/room.interface';
import { IUser } from 'src/app/interfaces/user.interface';
import { RoomService } from 'src/app/services/room/room.service';
import { IMenu } from "src/app/interfaces/bill.interface";
import { Menu } from '../../../services/menu/menu.service';

@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.css']
})
export class FriendComponent implements OnInit {
  @ViewChild("myModal") modal!: ElementRef;

  roomId: string | null = "";
  room!: IUser[];

  keyword = "title";
  menus!: Menu[];
  menusInBill!: IMenu[];
  selectedMenu!: string;
  usersInRoom!: IUser[];

  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService,
  ) {}
  
  receiveSelectedMenu(value: string) {
    this.selectedMenu = value;
  }

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
