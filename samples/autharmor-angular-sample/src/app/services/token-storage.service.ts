import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class TokenStorageService {
    public readonly token$: BehaviorSubject<string | null>;

    private readonly storage: Storage;
    private readonly storageKey: string;

    public constructor() {
        this.storage = window.localStorage;
        this.storageKey = "app-auth-token";

        this.token$ = new BehaviorSubject(this.getToken());
    }

    public saveToken(token: string): void {
        this.storage.setItem(this.storageKey, token);
        this.token$.next(token);
    }

    public clearToken(): void {
        this.storage.removeItem(this.storageKey);
        this.token$.next(null);
    }

    private getToken(): string | null {
        return window.localStorage.getItem(this.storageKey);
    }
}
