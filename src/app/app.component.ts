// import { identifierName, ReturnStatement } from "@angular/compiler";
import { Component } from "@angular/core";
import { Student } from "./student";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.less"]
})
export class AppComponent {
  title = "student_list";

  // массив студентов
  students: Student[] = [];
  classOff: boolean = false;
  fiterParam: string = "number";
  filterStart: Date | number = 0.0;
  filterEnd: Date | number = 5.0;
  processDel: boolean = false;
  delStudent: Student = new Student("n", "s", "p", new Date(), 0);

  constructor(){
    this.fillStudent();
  }

  fillStudent(): void {
    const names: string[] = ["Виктория", "Таисия", "Роберт", "Мирослава",
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
  }

  getAllStudent(): Student[] {
    return this.students;
  }

  setClassOff(): void {
    if (this.classOff){
      this.classOff = false;
    } else {
      this.classOff = true;
    }
  }

  setFilterParam(param: string): void {
    this.fiterParam = param;
    switch (this.fiterParam){
      case "number":
        this.filterStart = 0.0;
        this.filterEnd = 5.0;
        break;
      case "date":
        this.filterStart = new Date("1998-12-31");
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
              if (limit){
                this.filterStart = +limit;
              } else {
                this.filterStart = 0.0;
              }
              break;
            case "end":
              if (limit){
                this.filterEnd = +limit;
              } else {
                this.filterEnd = 5.0;
              }
              break;
            default:
              break;
          }
          break;
        case "date":
          switch (position){
            case "start":
              if (limit){
                this.filterStart = new Date(limit);
              } else {
                this.filterStart = new Date("1998-12-31");
              }
              break;
            case "end":
              if (limit){
                this.filterEnd = new Date(limit);
              } else {
                this.filterEnd = new Date();
              }
              break;
            default:
              break;
          }
          break;
        default:
          break;
      }
  }

  setStudClass(stud: Student): string {
    let res: string = "";
    // если распределение включено
    if (!this.classOff) {
      if (stud.middleMark < 3.0) {
        res += "badMark ";
      }
    }
    if (stud.find) {
      res += "findST ";
    }
    if (stud.procDel) {
      res += "procDel";
    } else {
      if (res.includes("procDel")) {
        res.replace("procDel", "");
      }
    }
    return res;
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
          if (stud.name.toLowerCase().startsWith(key.trim().toLowerCase())) {
            stud.find = true;
          } else {
            stud.find = false;
          }
          break;
        case "surname":
          if (stud.surname.toLowerCase().startsWith(key.trim().toLowerCase())) {
            stud.find = true;
          } else {
            stud.find = false;
          }
          break;
        case "patronym":
          if (stud.patronym.toLowerCase().startsWith(key.trim().toLowerCase())) {
            stud.find = true;
          } else {
            stud.find = false;
          }
          break;
        default:
          break;
      }
    }
  }

  filterStud(): void {
    switch (this.fiterParam){
      case "number":
        for (const stud of this.students){
          if ((stud.middleMark < this.filterStart) || (stud.middleMark > this.filterEnd)) {
            // не подходит под диапозон
            stud.filtred = false;
          } else {
            stud.filtred = true;
          }
        }
        break;
      case "date":
        for (const stud of this.students){
          if ((stud.birthdate < this.filterStart) || (stud.birthdate > this.filterEnd)) {
            // не подходит под диапозон
            stud.filtred = false;
          } else {
            stud.filtred = true;
          }
        }
        break;
      default:
        break;
    }
  }

  notFilter(): void {
    for (const stud of this.students){
      stud.filtred = true;
    }
  }

  sortStud(param: string = "id" ): void {
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
  }

  getShowMessage(): boolean {
    return this.processDel;
  }

  deleteRow(): void {
    this.delStudent.deleted = true;
    this.popupOff();
  }

  popupOff(stud?: Student): void {
    if (stud){
      this.delStudent = stud;
      stud.procDel = true;
      this.setStudClass(stud);
    } else {
      this.delStudent.procDel = false;
      this.setStudClass(this.delStudent);
    }
    this.processDel = !this.processDel;
  }
}
