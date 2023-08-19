/// <reference types="@hcaptcha/types"/>

import { ICaptchaConfirmationRequest } from "@autharmor/autharmor-js";
import { JSX, createEffect, onCleanup } from "solid-js";
import { useTranslationTable } from "../i18n";
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

    const handleCaptchaSubmission = () => {
        const captchaConfirmation: ICaptchaConfirmationRequest = {
            hCaptchaResponse: hcaptcha.getResponse(captchaId),
            hCaptchaResponseKey: hcaptcha.getRespKey(captchaId)
        };

        props.onConfirm(captchaConfirmation);
    };

    createEffect(() => {
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
            <p class={promptStyles.prompt}>Verifying request.</p>
            <p class={promptStyles.promptDescription}>
                We’re verifying that you're not a robot. You may need to complete a challenge.
            </p>
            <div class={promptStyles.promptAction}>
                <div ref={captchaRef} />
            </div>
        </div>
    );
}
