/// <reference types="@hcaptcha/types"/>

import { ICaptchaConfirmationRequest } from "@autharmor/autharmor-js";
import { JSX, JSXElement, createEffect, createSignal, onCleanup } from "solid-js";
import { CaptchaPrompt } from "./CaptchaPrompt";

export type CaptchaProtectedWindowProps = {
    hCaptchaSiteId: string | null;

    isCaptchaRequired: boolean;

    children: JSXElement;

    onConfirm: (captchaConfirmation: ICaptchaConfirmationRequest) => void;

    class?: string;
    style?: string | JSX.CSSProperties;
};

export function CaptchaProtectedWindow(props: CaptchaProtectedWindowProps) {
    let captchaRef: HTMLElement = null!;
    let captchaId: string = null!;

    const [isCaptchaLoaded, setIsCaptchaLoaded] = createSignal<boolean>(
        typeof hcaptcha !== "undefined"
    );

    const [isCaptchaActive, setIsCaptchaActive] = createSignal<boolean>(false);

    createEffect(() => {
        if (props.hCaptchaSiteId !== null && props.isCaptchaRequired && !isCaptchaLoaded()) {
            const script = document.createElement("script");
            script.src = "https://js.hcaptcha.com/1/api.js";
            script.async = true;
            script.defer = true;

            script.onload = () => setIsCaptchaLoaded(true);

            document.head.appendChild(script);
        }
    });

    const handleCaptchaSubmission = () => {
        const captchaConfirmation: ICaptchaConfirmationRequest = {
            hCaptchaResponse: hcaptcha.getResponse(captchaId),
            hCaptchaResponseKey: hcaptcha.getRespKey(captchaId)
        };

        setIsCaptchaActive(false);

        props.onConfirm(captchaConfirmation);
    };

    const handleCaptchaOpen = () => {
        setIsCaptchaActive(true);
    };

    createEffect(() => {
        if (!isCaptchaLoaded() || !props.isCaptchaRequired) {
            return;
        }

        const _captchaId = hcaptcha.render(captchaRef, {
            sitekey: props.hCaptchaSiteId!,
            callback: handleCaptchaSubmission,
            "open-callback": handleCaptchaOpen
        });

        captchaId = _captchaId;

        hcaptcha.execute(captchaId);

        onCleanup(() => {
            hcaptcha.reset(_captchaId);
            hcaptcha.remove(_captchaId);
        });
    });

    return (
        <div>
            <CaptchaPrompt
                style={{ display: isCaptchaActive() ? undefined : "none" }}
                captcha={<div ref={captchaRef as HTMLDivElement} />}
            />
            <div style={{ display: isCaptchaActive() ? "none" : undefined }}>{props.children}</div>
        </div>
    );
}
