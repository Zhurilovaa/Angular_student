import { Component, Input, ChangeDetectionStrategy  } from "@angular/core";
import { FormControl, FormGroup, Validators, AbstractControl } from "@angular/forms";
import { formatDate } from "@angular/common" ;
import { Student } from "../student";

export interface ValidationErrors {
    [key: string]: unknown;
}


@Component({
    selector: "app-formStud",
    templateUrl: "./formStud.component.html",
    styleUrls: ["./formStud.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormStudComponent {
    @Input() students: Student[] = [];
    @Input() tableS: Student[] = [];
    @Input() param: string = "";
    @Input() idStud: number = -1;

    popUpAdd: boolean = false;
    popUpEdit: boolean = false;

    formStud: FormGroup = new FormGroup({
        studName: new FormGroup({
            name: new FormControl(null, [Validators.required, Validators.pattern("[а-яА-Я]*")]),
            patronym: new FormControl(null, [Validators.required, Validators.pattern("[а-яА-Я]*")]),
            surname: new FormControl(null, [Validators.required, Validators.pattern("[а-яА-Я]*")])
        }, this.fullNameValidator),
        bDate: new FormControl(null, [Validators.required, this.ageRangeValidator]),
        mark: new FormControl(null, [Validators.required, this.markRangeValidator])
    });

    setPopUpAddOrEdit(): void {
        this.popUpAdd = (this.param === "add") ? true : false;
        this.popUpEdit = (this.param === "edit") ? true : false;
        if (this.popUpEdit){
            this.setValue();
        }
    }
    getPopUpAdd(): boolean {
        return this.popUpAdd;
    }

    getPopUpEdit(): boolean {
        return this.popUpEdit;
    }

    popUpCloseStud(): void {
        if (this.popUpEdit){
            this.tableS[this.idStud].procEdit = false;
        }
        this.popUpAdd = false;
        this.popUpEdit = false;
        this.formStud.reset();
    }

    // валидаторы
    // валидатор проверки ФИО на совпадения
    fullNameValidator(control: AbstractControl): ValidationErrors | null {
        if (control.value.name === control.value.surname) {
            return { "error": "name = surname" };
        }
        if (control.value.name === control.value.patronym) {
            return { "name=patronym": true };
        }
        return null;
    }
    // валидатор проверки даты в диапазоне
    ageRangeValidator(control: AbstractControl): ValidationErrors | null {
        const inputDate = new Date(control.value);
        let today = new Date();
        const minDate: Date = new Date(today.setFullYear(today.getFullYear() - 30));
        today = new Date();
        const maxDate: Date = new Date(today.setFullYear(today.getFullYear() - 10));
        if (inputDate > maxDate) {
            return {
                "requiredDate<": maxDate.toLocaleDateString(),
                "inputDate: ": inputDate.toLocaleDateString()
            };
        }
        if (inputDate < minDate) {
            return {
                "requiredDate>": minDate.toLocaleDateString(),
                "inputDate: ": inputDate.toLocaleDateString()
            };
        }
        return null;
    }
    // валидатор проверки оценки в диапазоне
    markRangeValidator(control: AbstractControl): ValidationErrors | null {
        const inputMark = +(control.value);
        const minMark: number = 0.0;
        const maxMark: number = 5.0;
        if (inputMark > maxMark) {
            return {
                "requiredMark<": maxMark,
                "inputMark: ": inputMark
            };
        }
        if (inputMark < minMark) {
            return {
                "requiredMark>": minMark,
                "inputMark: ": inputMark
            };
        }
        return null;
    }

    private setValue(): void {
        const studToEdit = this.tableS[this.idStud];
        this.tableS[this.idStud].procEdit = true;
        if (studToEdit !== undefined){
            const correctDate = studToEdit?.birthdate;
            this.formStud.get("bDate")?.setValue(formatDate(correctDate.toLocaleDateString().split(".").reverse().join("-"), "yyyy-MM-dd", "en"));
            this.formStud.get("studName")?.setValue({ surname: studToEdit?.surname, name: studToEdit?.name, patronym: studToEdit?.patronym });
            this.formStud.get("mark")?.setValue(studToEdit?.middleMark);
        }
    }

    private beautifulName(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    addOrEditStudent(): void {
        if (this.formStud.valid){
            let name: string = this.formStud.value.studName.name;
            name = this.beautifulName(name);
            let patronym = this.formStud.value.studName.patronym;
            patronym = this.beautifulName(patronym);
            let surname = this.formStud.value.studName.surname;
            surname = this.beautifulName(surname);
            const birthDate = new Date(this.formStud.value.bDate);
            const mark = +(this.formStud.value.mark);
            // создаем новый объект студент
            const currStud = new Student(name, patronym, surname, birthDate, mark);
            // добавляем
            if (this.popUpAdd){
                this.students.push(currStud);
                this.tableS.push(currStud);
                this.popUpCloseStud();
            } else if (this.popUpEdit){ // редактируем
                this.tableS[this.idStud].editStudent(name, patronym, surname, birthDate, mark);
                this.popUpCloseStud();
                this.tableS[this.idStud].procEdit = false;
            }
        }
    }
    /*
    //Вариант с вводом id студента (прошлый вариант)
    id: number = -1;
    popUpEditIdStud: boolean = false;
    popUpError: boolean = false;
    setPopUpEditId(): void {
        this.popUpEditIdStud = true;
    }
    getPopUpEditId(): boolean {
        return this.popUpEditIdStud;
    }
    popUpIdClose(): void {
        this.popUpEditIdStud = false;
    }
    setPopUpEdit(): void {
        this.popUpEdit = true;
    }
    setPopUpError(): void {
        this.popUpError = true;
    }
    getPopUpError(): boolean {
        return this.popUpError;
    }
    popUpErrorClose(): void {
        this.popUpError = false;
    }
    checkId(idInput: string): void {
        const idcheck: number = +idInput;
        if ((idInput) && (idcheck >= 1) && (idcheck <= this.tableS.length) && ((idcheck % 1) === 0)) {
                this.idStud = idcheck;
                this.popUpIdClose();
                //this.setPopUpEdit();
                this.setValue();
        } else {
            this.setPopUpError();
        }
    }*/

}
