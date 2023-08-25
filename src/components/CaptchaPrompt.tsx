/// <reference types="@hcaptcha/types"/>

import { ICaptchaConfirmationRequest } from "@autharmor/autharmor-js";
import { JSX, createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { translationTables, useTranslationTable } from "../i18n";
import promptStyles from "./Prompt.module.css";

export type CaptchaPromptProps = {
    hCaptchaSiteId: string;

    onConfirm: (captchaConfirmation: ICaptchaConfirmationRequest) => void;

    class?: string;
    style?: string | JSX.CSSProperties;
};

export function CaptchaPrompt(props: CaptchaPromptProps) {
    const tt = useTranslationTable();

    let captchaRef: HTMLDivElement = null!;
    let captchaId: string = null!;

    const [isCaptchaLoaded, setIsCaptchaLoaded] = createSignal<boolean>(
        typeof hcaptcha !== "undefined"
    );

    onMount(() => {
        if (!isCaptchaLoaded()) {
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

        props.onConfirm(captchaConfirmation);
    };

    createEffect(() => {
        if (!isCaptchaLoaded()) {
            return;
        }

        const _captchaId = hcaptcha.render(captchaRef, {
            sitekey: props.hCaptchaSiteId!,
            callback: handleCaptchaSubmission
        });

        captchaId = _captchaId;

        hcaptcha.execute(captchaId);

        onCleanup(() => {
            hcaptcha.reset(_captchaId);
            hcaptcha.remove(_captchaId);
        });
    });

    return (
        <div class={props.class} style={props.style}>
            <p class={promptStyles.prompt}>{tt().form.prompts.captcha.title}.</p>
            <p class={promptStyles.promptDescription}>{tt().form.prompts.captcha.description}</p>
            <div class={promptStyles.promptAction}>
                <div ref={captchaRef} />
            </div>
        </div>
    );
}
