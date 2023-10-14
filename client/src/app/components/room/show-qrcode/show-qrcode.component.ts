import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IRoom } from 'src/app/interfaces/room.interface';
import { RoomService } from 'src/app/services/room/room.service';

@Component({
  selector: 'app-show-qrcode',
  templateUrl: './show-qrcode.component.html',
  styleUrls: ['./show-qrcode.component.css']
})
export class ShowQrcodeComponent implements OnInit {

  @ViewChild("myModal") modal!: ElementRef;

  roomId: string | null = "";
  room!: IRoom;
  qrCodeSplit!: string[]
  promtpay!: string;

  constructor(
    private roomService: RoomService,
    private route: ActivatedRoute
  ) {}

  openModal() {
    this.modal.nativeElement.showModal();
  }
  closeModal() {
    this.modal.nativeElement.close();
  }

  fetchRoomById(roomId: string | null) {
    this.roomService.getRoomById(roomId as string).subscribe({
        next: (room) => {
            this.room = room;
            this.qrCodeSplit = this.room.qrCode.split("/")
            this.promtpay = this.qrCodeSplit[3]
            console.log(this.promtpay);
            console.log("room", this.room.qrCode);
        },
    });
  }

  ngOnInit(): void {
    this.roomId = this.route.snapshot.paramMap.get("id");
    this.fetchRoomById(this.roomId)
  }
}
