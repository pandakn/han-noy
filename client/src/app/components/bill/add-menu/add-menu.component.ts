import { Component, Input } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { BillService } from "src/app/services/bill/bill.service";
import { Menu, MenuService } from "src/app/services/menu/menu.service";

interface AddMenuIntoBillPayload {
    menu: string | null | undefined;
    price: number;
    slip?: string;
    payerIds: Array<string | null | undefined>;
}

@Component({
    selector: "app-add-menu",
    templateUrl: "./add-menu.component.html",
    styleUrls: ["./add-menu.component.css"],
})
export class AddMenuComponent {
    @Input() selectedMenu!: string;
    @Input() billId!: string;
    @Input() usersInRoom!: any;
    @Input() isDisable!: boolean;

    // for autocomplete
    keyword = "title";
    menus!: Menu[];
    selectedUsers: string[] = [];
    // slipFile!: File;
    selectedImage: string | null = null;

    menuForm = new FormGroup({
        menu: new FormControl(this.selectedMenu, Validators.required),
        price: new FormControl(0, [Validators.required, Validators.min(0)]),
        payerIds: new FormArray([]),
        slip: new FormControl(null),
    });

    constructor(
        private menuService: MenuService,
        private billService: BillService
    ) {}

    ngOnInit() {
        // this.roomId = this.route.snapshot.paramMap.get("id");
        this.fetchMenus();
    }

    handleImageUpload(event: any): void {
        const file = event.target.files[0];
        // console.log("file:", file);

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.selectedImage = e.target?.result as string;
            };

            // console.log(reader);
            reader.readAsDataURL(file);
            this.menuForm.patchValue({
                slip: file,
            });
            this.menuForm.get("slip")?.updateValueAndValidity();
        }
    }

    removeImage(): void {
        this.selectedImage = null;
    }

    fetchMenus() {
        this.menuService.getMenu().subscribe({
            next: (menus) => {
                this.menus = menus;
                // console.log("menus", this.menus);
            },
        });
    }

    onChoosePayer(id: string) {
        const payerIdsArray = this.menuForm.get("payerIds") as FormArray;

        const existingPayerIndex = payerIdsArray.controls.findIndex(
            (control) => control.value === id
        );

        if (existingPayerIndex === -1) {
            // User not selected, add to the FormArray and selectedUsers
            payerIdsArray.push(new FormControl(id));
            this.selectedUsers.push(id);
        } else {
            // User already selected, remove from the FormArray and selectedUsers
            payerIdsArray.removeAt(existingPayerIndex);
            this.selectedUsers.splice(existingPayerIndex, 1);
        }
    }

    isSelected(userId: string): boolean {
        return this.selectedUsers.includes(userId);
    }

    onSubmit() {
        this.menuForm.get("menu")?.setValue(this.selectedMenu);
        const formData = new FormData();

        const data = {
            menu: this.menuForm.value.menu,
            price: this.menuForm.value.price || 0,
            slip: this.menuForm.value.slip || null,
            payerIds: this.menuForm.value.payerIds || [],
        };

        formData.append("menu", data.menu || "");
        formData.append("price", data.price.toString() || "");

        data.payerIds.forEach((payer) => {
            formData.append("payerIds[]", payer);
        });

        // console.log(this.slipFile);

        formData.append("slip", data.slip || ""); // Append the slip file

        this.billService.addMenuIntoBill(this.billId, formData).subscribe({
            next: (response) => {
                console.log("Success data:", response);
                this.menuForm.reset();
                window.location.reload();
            },
            error: (error) => {
                console.error("Error:", error);
            },
        });
    }
}
