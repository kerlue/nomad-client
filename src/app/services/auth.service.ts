import {Injectable, inject, WritableSignal, signal} from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  static baldorUserId: WritableSignal<string> = signal<string>('');
  static baldorSecret: WritableSignal<string> = signal<string>('');

  static clientSecretInterceptor: HttpInterceptorFn = (req: any, next: any) => {
    const userId = AuthService.baldorUserId();
    const token = AuthService.baldorSecret();

    console.log(userId, token);

    const updatedReq = req.clone({
      params: req.params
        .set('userId', userId)
        .set('token', token),
    });

    return next(updatedReq);
  };
}
