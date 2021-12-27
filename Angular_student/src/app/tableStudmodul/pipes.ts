import { Pipe, PipeTransform } from "@angular/core";


@Pipe({
  name: "niceName"
})
export class NiceNamePipe implements PipeTransform {
  transform(strName: string): string {
    const firstChar = strName.charAt(0).toUpperCase();
    const partName = strName.slice(1);
    const res = firstChar + partName.toLocaleLowerCase();
    return res;
}
}

@Pipe({
  name: "niceDate"
})
export class NiceDatePipe implements PipeTransform {
  transform(bDate: Date): string {
    const date = bDate.getDate();
        const month = bDate.getMonth();
        const year = bDate.getFullYear();
        let res = "";
        if (date < 10){
            res = "0";
        }
        res += date + ".";
        if (month < 9){
            res += "0";
        }
        res += (month + 1) + ".";
        res += year;
        return res;
  }
}
