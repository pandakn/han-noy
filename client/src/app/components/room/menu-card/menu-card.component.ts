import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { IUser } from "src/app/interfaces/user.interface";
import { environment } from "src/environments/environment.development";
import { UpdatePayerComponent } from "../../bill/update-payer/update-payer.component";
import { BillService } from "src/app/services/bill/bill.service";
import { ToastrService } from "ngx-toastr";
import { priceWithCommas } from "src/app/utils/formatPrice";

@Component({
    selector: "app-menu-card",
    templateUrl: "./menu-card.component.html",
    styleUrls: ["./menu-card.component.css"],
})
export class MenuCardComponent implements OnInit {
    @Input() id!: string;
    @Input() billId!: string;
    @Input() title: string = "";
    @Input() price: number = 0;
    @Input() amount: number = 0;
    @Input() payers!: IUser[];
    @Input() slip!: string;
    @Input() usersInRoom!: IUser[];

    formatPrice: string = "";
    formatAmount: string = "";

    @ViewChild(UpdatePayerComponent)
    updatePayerComponent!: UpdatePayerComponent;

    imageUrl = environment.apiUrlImage;

    constructor(
        private billService: BillService,
        private toastr: ToastrService
    ) {}

    ngOnInit(): void {
        this.formatPrice = priceWithCommas(this.price.toString());
        this.formatAmount = priceWithCommas(this.amount.toString());
    }

    openModal() {
        this.updatePayerComponent.openModal();
    }

    onRemoveMenuFromBill() {
        console.log("menu id:", this.id);

        this.billService.removeMenuFromBill(this.billId, this.id).subscribe({
            next: () => {
                this.toastr.error("remove menu Successfully", "remove", {
                    timeOut: 2000,
                });
            },
        });
    }
}
