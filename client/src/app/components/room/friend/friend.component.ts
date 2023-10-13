import { Component, OnInit } from '@angular/core';
import { ShowRoomComponent } from '../show-room/show-room.component';

@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.css']
})
export class FriendComponent implements OnInit {

  constructor(private id: ShowRoomComponent) {}

  ngOnInit(): void {
      console.log(this.id)
  }

}
