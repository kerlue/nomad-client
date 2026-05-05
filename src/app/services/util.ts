import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Util {

  static filterJson(value: any, query: string) {
    if (value === null || value === undefined) {
      return undefined;
    }

    // Primitive: keep if its string form contains the query
    if (typeof value !== 'object') {
      return String(value).toLowerCase().includes(query) ? value : undefined;
    }

    // Array: filter elements, keep those that have matches
    if (Array.isArray(value)) {
      const result: any[] = [];
      for (const item of value) {
        const filtered = this.filterJson(item, query);
        if (filtered !== undefined) {
          result.push(filtered);
        }
      }
      return result.length > 0 ? result : undefined;
    }

    // Object: check each key/value pair
    const result: Record<string, any> = {};
    let hasMatch = false;
    for (const key of Object.keys(value)) {
      const child = value[key];
      const keyMatches = key.toLowerCase().includes(query);

      if (keyMatches) {
        // Key matches: keep the entire subtree as-is
        result[key] = child;
        hasMatch = true;
      } else {
        // Key doesn't match: recurse into the value
        const filteredChild = this.filterJson(child, query);
        if (filteredChild !== undefined) {
          result[key] = filteredChild;
          hasMatch = true;
        }
      }
    }
    return hasMatch ? result : undefined;
  }
}
