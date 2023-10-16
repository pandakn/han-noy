import { Component, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { IMenu } from "src/app/interfaces/bill.interface";
import { IRoom } from "src/app/interfaces/room.interface";
import { IUser } from "src/app/interfaces/user.interface";
import { BillService } from "src/app/services/bill/bill.service";
import { Menu, MenuService } from "src/app/services/menu/menu.service";
import { RoomService } from "src/app/services/room/room.service";
import { priceWithCommas } from "src/app/utils/formatPrice";

@Component({
    selector: "app-show-room",
    encapsulation: ViewEncapsulation.None,
    templateUrl: "./show-room.component.html",
    styleUrls: ["./show-room.component.css"],
})
export class ShowRoomComponent {
    roomId: string | null = "";
    room!: IRoom;
    billId!: string;
    switchComponent: boolean = true;

    keyword = "title";
    menus!: Menu[];
    menusInBill!: IMenu[];
    selectedMenu!: string;
    usersInRoom!: IUser[];
    userCount: number = 0;
    totalPrice: string = "";
    totalUserAmount: number = 0;
    isShowAddMenuModal = false;
    totalAmountToPay: { [userId: string]: number } = {};

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
                this.totalPrice = priceWithCommas(
                    this.room.bill.totalPrice.toString()
                );
                this.usersInRoom = this.room.users;
                this.userCount = this.usersInRoom.length;
                this.calculateTotalAmountToPay();
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

    calculateTotalAmountToPay() {
        this.usersInRoom.forEach((user) => {
            this.totalAmountToPay[user._id] = 0;
        });

        this.menusInBill.forEach((menu) => {
            menu.payers.forEach((payer) => {
                this.totalAmountToPay[payer._id] += menu.amount;
            });
        });
    }
}
