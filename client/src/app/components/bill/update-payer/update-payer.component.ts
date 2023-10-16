import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { IUser } from "src/app/interfaces/user.interface";
import { BillService } from "src/app/services/bill/bill.service";
import { environment } from "src/environments/environment.development";

@Component({
    selector: "app-update-payer",
    templateUrl: "./update-payer.component.html",
    styleUrls: ["./update-payer.component.css"],
})
export class UpdatePayerComponent implements OnInit {
    @Input() billId!: string;
    @Input() menuInBillId!: string;
    @Input() payers!: IUser[];
    @Input() title: string = "";
    @Input() price: number = 0;
    @Input() amount: number = 0;
    @Input() slip!: string;
    @Input() usersInRoom!: IUser[];

    @ViewChild("updatePayerModal") modal!: ElementRef;
    @ViewChild("myModal") modal1!: ElementRef;

    selectedPayers: string[] = [];

    updatePayerForm = new FormGroup({
        payerIds: new FormArray([]),
    });

    payerIds = new FormArray([]);
    imageUrl = environment.apiUrlImage;

    constructor(private billService: BillService) {}

    ngOnInit(): void {
        // console.log("payers:", this.payers);
        // console.log("users in room:", this.usersInRoom);

        this.usersInRoom = this.usersInRoom.filter(
            (user) => !this.payers.some((payer) => payer._id === user._id)
        );
    }

    openModal() {
        this.modal.nativeElement.showModal();
        // console.log("menu id:", this.menuInBillId);
    }
    openModal1() {
        this.modal1.nativeElement.showModal();
        // console.log("menu id:", this.menuInBillId);
    }

    closeModal() {
        this.modal.nativeElement.close();
    }
    closeModal1() {
        this.modal1.nativeElement.close();
    }
    
    onChoosePayer(id: string) {
        const payerIdsArray = this.updatePayerForm.get("payerIds") as FormArray;

        const existingPayerIndex = payerIdsArray.controls.findIndex(
            (control) => control.value === id
        );

        if (existingPayerIndex === -1) {
            // User not selected, add to the FormArray and selectedPayers
            payerIdsArray.push(new FormControl(id));
            this.selectedPayers.push(id);
        } else {
            // User already selected, remove from the FormArray and selectedPayers
            payerIdsArray.removeAt(existingPayerIndex);
            this.selectedPayers.splice(existingPayerIndex, 1);
        }
    }

    isSelected(userId: string): boolean {
        return this.selectedPayers.includes(userId);
    }

    onAddPayer() {
        const data = {
            userIds: this.updatePayerForm.value.payerIds,
        };

        this.billService
            .addPayers(this.billId, this.menuInBillId, data)
            .subscribe({
                next: () => {},
            });
    }

    onRemovePayer(payerId: string) {
        // console.log("payer id:", payerId);
        const data = {
            userId: payerId,
        };

        this.billService
            .removePayer(this.billId, this.menuInBillId, data)
            .subscribe({
                next: () => {
                    // // Remove the payer from the local list
                    // this.payers = this.payers.filter(
                    //     (payer) => payer._id !== payerId
                    // );
                },
            });
    }
}
