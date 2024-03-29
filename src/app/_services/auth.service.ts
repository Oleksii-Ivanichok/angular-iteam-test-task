import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, map} from "rxjs";
import {UserInfo, UserLogin} from "../_models/user";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = 'https://user-assessment-api.vercel.app/';
  private currentUserSource = new BehaviorSubject<UserInfo | null>(null);
  currentUser$ = this.currentUserSource.asObservable();
  constructor(private http: HttpClient) { }

  login(user: UserLogin) {
    return this.http.post<UserInfo>(this.baseUrl + 'api/login', user).pipe(
      map((response: UserInfo) => {
        const user = response;
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.setCurrentUser(user);
        }
      })
    )
  }

  setCurrentUser(user: UserInfo) {
    this.currentUserSource.next(user);
  }

  logout() {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }
  isAdmin(){
    return this.currentUser$.pipe(
      map(user => user?.role === 'Admin')
    );
  }

}
