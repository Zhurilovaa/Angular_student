// import { identifierName, ReturnStatement } from "@angular/compiler";
import { Component, ChangeDetectionStrategy } from "@angular/core";
import { Student } from "./student";

@Component({
  selector: "app-workStud",
  templateUrl: "./tableStud.component.html",
  styleUrls: ["./tableStud.component.less"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableStudComponent {
  title = "student_list";

  // массив студентов
  students: Student[] = [];
  // для вывода в таблицу
  tableStud: Student[] = [];
  classOn: boolean = true;
  fiterParam: string = "number";
  filterStart: Date | number = 0.0;
  filterEnd: Date | number = 5.0;
  minDate: Date = new Date();
  processDel: boolean = false;
  delStudent: Student = new Student("n", "s", "p", new Date(), 0);

  constructor(){
    const today = new Date();
    this.minDate = new Date(today.setFullYear(today.getFullYear() - 30));
    this.fillStudent();
  }

  fillStudent(): void {
    const names: string[] = ["виктория", "Таисия", "Роберт", "Мирослава",
    "Максим", "Анна", "Маргарита", "Максим", "Ян", "Максим", "Виктория"];

    const surnames: string[] = ["Сергеева", "Никифорова", "Бирюков", "Сомова",
    "Раков", "Селиванова", "Михайлова", "Корнилов", "Пахомов", "Баженов", "Сергеева"];

    const patronymic: string[] = ["Марковна", "Николаевна", "Ильич", "Платоновна",
    "Николаевич", "Михайловна", "Тимофеевна", "Леонидович", "Максимович", "Даниилович", "Марковна"];

    const birthDates: Date[] = [
      new Date(1999, 0, 15),
      new Date(2000, 1, 27),
      new Date(2000, 5, 13),
      new Date(2000, 6, 4),
      new Date(2000, 7, 12),
      new Date(2000, 9, 5),
      new Date(2001, 7, 4),
      new Date(2001, 7, 8),
      new Date(2002, 5, 5),
      new Date(2002, 7, 9),
      new Date(1999, 0, 15),
    ];

    const middleMark: number[] = [22.7, 2.8, 2.4, 4.2, 3.0, 2.6, 2.5, 3.1, 4.4, 4.3, 3.3];

    for (let i: number = 0; i < names.length; i++) {
      const tempStud = new Student(names[i], patronymic[i], surnames[i], birthDates[i], middleMark[i]);
      this.students.push(tempStud);
    }
    this.sortStud();
    this.createTableStud();
  }

  createTableStud(): void{
    this.tableStud = [];
    for (const stud of this.students){
      // условие попадания в таблицу
      if (stud.filtred && !(stud.deleted)) {
        this.tableStud.push(stud);
      }
    }
  }

  getAllStudent(): Student[] {
    return this.tableStud;
  }

  setClassOn(): void {
    this.classOn = this.classOn ? false : true;
  }
  getClassOn(): boolean {
    return this.classOn;
  }

  setFilterParam(param: string): void {
    this.fiterParam = param;
    switch (this.fiterParam){
      case "number":
        this.filterStart = 0.0;
        this.filterEnd = 5.0;
        break;
      case "date":
        this.filterStart = this.minDate;
        this.filterEnd = new Date();
        break;
      default:
        break;
    }
  }

  setFilter(limit: string, position: string): void {
      switch (this.fiterParam){
        case "number":
          switch (position){
            case "start":
              this.filterStart = limit ? +limit : 0.0 ;
              break;
            case "end":
              this.filterEnd = limit ? +limit : 5.0;
              break;
            default:
              break;
          }
          break;
        case "date":
          switch (position){
            case "start":
              this.filterStart = limit ? new Date(limit) : this.minDate;
              break;
            case "end":
              this.filterEnd = limit ? new Date(limit) : new Date();
              break;
            default:
              break;
          }
          break;
        default:
          break;
      }
  }

  findStudent(key: string, param: string): void {
    if (key === "") {
      for (const stud of this.students) {
        stud.find = false;
      }
      return;
    }
    for (const stud of this.students) {
      switch (param) {
        case "name":
            stud.find = stud.name.toLowerCase().startsWith(key.trim().toLowerCase()) ? true : false;
          break;
        case "surname":
            stud.find = stud.surname.toLowerCase().startsWith(key.trim().toLowerCase()) ?  true : false;
          break;
        case "patronym":
            stud.find = stud.patronym.toLowerCase().startsWith(key.trim().toLowerCase()) ? true : false;
          break;
        default:
          break;
      }
    }
    this.createTableStud();
  }

  filterStud(): void {
    switch (this.fiterParam){
      case "number":
        for (const stud of this.students){
          // не подходит под диапозон
          stud.filtred = ((stud.middleMark < this.filterStart) || (stud.middleMark > this.filterEnd)) ? false : true ;
        }
        break;
      case "date":
        for (const stud of this.students){
          // не подходит под диапозон
          stud.filtred = ((stud.birthdate < this.filterStart) || (stud.birthdate > this.filterEnd)) ? false : true ;
        }
        break;
      default:
        break;
    }
    this.createTableStud();
  }

  notFilter(): void {
    for (const stud of this.students){
      stud.filtred = true;
    }
    this.createTableStud();
  }

  sortStud(param: string = "id"): void {
    this.students.sort((prev: Student, next: Student) => {
      if (prev.getFieldByKey(param) < next.getFieldByKey(param)) {
        return -1;
      }
      if (prev.getFieldByKey(param) > next.getFieldByKey(param)) {
        return 1;
      }
      if (param === "id"){
        return prev.middleMark - next.middleMark;
      }
      return 0;
    });
    this.createTableStud();
  }

  getShowMessage(): boolean {
    return this.processDel;
  }

  deleteRow(): void {
    this.delStudent.deleted = true;
    this.createTableStud();
    this.popupOff();
  }

  popupOff(stud?: Student): void {
    if (stud){
      this.delStudent = stud;
      stud.procDel = true;
    } else {
      this.delStudent.procDel = false;
    }
    this.processDel = !this.processDel;
  }
}
