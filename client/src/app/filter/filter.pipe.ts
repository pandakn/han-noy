import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "FilterPipe",
})
export class FilterPipe<T> implements PipeTransform {
    transform(items: T[], searchText: string, property: keyof T): T[] {
        if (!items) {
            return [];
        }
        if (!searchText) {
            return items;
        }
        searchText = searchText.toLowerCase();

        return items.filter((item) => {
            const value = (item[property] as string).toLowerCase();
            return value.includes(searchText);
        });
    }
}
