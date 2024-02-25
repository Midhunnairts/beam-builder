import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }
  private loggedInUsernameSubject = new BehaviorSubject<string>(''); // Initial value is an empty string
  loggedInUsername$ = this.loggedInUsernameSubject.asObservable();

  setLoggedInUsername(username: string) {
    this.loggedInUsernameSubject.next(username);
  }
}
