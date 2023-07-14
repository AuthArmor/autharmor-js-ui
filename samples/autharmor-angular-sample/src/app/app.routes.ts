import { Routes } from "@angular/router";

export const routes: Routes = [
    {
        path: "imperative-auth",
        loadComponent: () =>
            import("./pages/imperative-auth/imperative-auth.component").then(
                (m) => m.ImperativeAuthComponent
            )
    },
    {
        path: "sign-up-log-in",
        loadComponent: () =>
            import("./pages/sign-up-log-in/sign-up-log-in.component").then(
                (m) => m.SignUpLogInComponent
            )
    },
    {
        path: "",
        pathMatch: "full",
        loadComponent: () => import("./pages/home/home.component").then((m) => m.HomeComponent)
    }
];
