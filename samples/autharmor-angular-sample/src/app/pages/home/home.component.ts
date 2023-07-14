import { Component, OnDestroy, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { Subscription, filter, map, merge, switchMap } from "rxjs";
import { TokenStorageService } from "src/app/services/token-storage.service";
import { SampleBackendService } from "src/app/services/sample-backend.service";
import { LogInRequest } from "src/app/api-models/log-in.request";
import { RegisterWithMagicLinkRequest } from "src/app/api-models/register-with-magic-link.request";

@Component({
    selector: "app-home",
    standalone: true,
    imports: [CommonModule],
    templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit, OnDestroy {
    private token$ = this.tokenService.token$;
    private magicLinkLogInRequestTokens$ = this.activatedRoute.queryParamMap.pipe(
        filter((p) => p.has("auth_request_id") && p.has("auth_validation_token")),
        map(
            (p) =>
                ({
                    requestId: p.get("auth_request_id")!,
                    authenticationMethod: "magicLinkEmail",
                    validationToken: p.get("auth_validation_token")!
                } satisfies LogInRequest)
        ),
        switchMap((r) => this.backendService.logIn(r)),
        map((r) => r.token)
    );
    private magicLinkRegisterRequestTokens$ = this.activatedRoute.queryParamMap.pipe(
        filter((p) => p.has("registration_validation_token")),
        map(
            (p) =>
                ({
                    validationToken: p.get("registration_validation_token")!
                } satisfies RegisterWithMagicLinkRequest)
        ),
        switchMap((r) => this.backendService.registerWithMagicLink(r)),
        map((r) => r.token)
    );
    private magicLinkTokens$ = merge(
        this.magicLinkLogInRequestTokens$,
        this.magicLinkRegisterRequestTokens$
    );

    private magicLinkTokenSubscription?: Subscription;

    public isAuthenticated$ = this.token$.pipe(map((t) => t !== null));
    public greeting$ = this.token$.pipe(
        switchMap(() => this.backendService.getGreeting()),
        map((g) => g.message)
    );

    public constructor(
        private readonly tokenService: TokenStorageService,
        private readonly backendService: SampleBackendService,
        private readonly activatedRoute: ActivatedRoute
    ) {}

    public ngOnInit(): void {
        this.magicLinkTokenSubscription = this.magicLinkTokens$.subscribe((t) =>
            this.tokenService.saveToken(t)
        );
    }

    public ngOnDestroy(): void {
        this.magicLinkTokenSubscription?.unsubscribe();
    }

    public logOut() {
        this.tokenService.clearToken();
    }
}
