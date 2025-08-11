import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface User {
  id: number;
  login: string;
  avatar: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly _user$ = new BehaviorSubject<User | null>(null);
  public readonly user$ = this._user$.asObservable();

  constructor(private http: HttpClient) {
    this.http.get<User>('/api/me').subscribe({
      next: user => this._user$.next(user),
      error: () => this._user$.next(null)
    });
  }

  login() {
    window.location.href = '/auth/github';
  }

  logout() {
    document.cookie = 'token=; Max-Age=0; path=/';
    window.location.reload();
  }
}
