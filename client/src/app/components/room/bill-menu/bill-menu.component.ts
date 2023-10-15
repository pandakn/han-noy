import { Component } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { IRoom } from "src/app/interfaces/room.interface";
import { IMenu } from "src/app/interfaces/bill.interface";
import { IUser } from "src/app/interfaces/user.interface";
import { Menu, MenuService } from "src/app/services/menu/menu.service";
import { RoomService } from "src/app/services/room/room.service";
import { BillService } from "src/app/services/bill/bill.service";

@Component({
  selector: 'app-bill-menu',
  templateUrl: './bill-menu.component.html',
  styleUrls: ['./bill-menu.component.css']
})
export class BillMenuComponent {
  
  roomId: string | null = "";
  room!: IRoom;
  billId!: string;

  keyword = "title";
  menus!: Menu[];
  menusInBill!: IMenu[];
  selectedMenu!: string;
  usersInRoom!: IUser[];

  isShowAddMenuModal = false;

  constructor(
    private route: ActivatedRoute,
    private roomService: RoomService,
    private menuService: MenuService,
    private billService: BillService
  ) {}

  ngOnInit() {
    this.roomId = this.route.snapshot.paramMap.get("id");
    this.fetchMenus();
    this.fetchRoomById(this.roomId);
    this.billService.refreshRequired.subscribe(() => {
        this.fetchRoomById(this.roomId);
    });
  }

  fetchRoomById(roomId: string | null) {
      this.roomService.getRoomById(roomId as string).subscribe({
          next: (room) => {
              this.room = room;
              // this.data = room.bill.menus;
              console.log("room", this.room);
              this.menusInBill = this.room.bill.menus;
              this.billId = this.room.bill._id;
              this.usersInRoom = this.room.users;
          },
      });
  }

  fetchMenus() {
      this.menuService.getMenu().subscribe({
          next: (menus) => {
              this.menus = menus;
          },
      });
  }

  receiveSelectedMenu(value: string) {
    this.selectedMenu = value;
  }

  setIsShowAddMenuModal() {
    this.isShowAddMenuModal = true;
    console.log("isShowAddMenuModal");
  }

}
