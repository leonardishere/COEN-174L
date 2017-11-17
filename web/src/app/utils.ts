import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

export function subscribeChanges(subject: Subject<any>, callback: (any) => any) {
  subject
    .debounceTime(300)
    .distinctUntilChanged()
    .subscribe(item => callback(item));
}

export function contains(haystack: string, needle: string): boolean {
  if(needle === "") return true;
  if(haystack == null || needle == null) return false;
  return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
}
