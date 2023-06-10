import { JSXElement } from "solid-js";
import styles from "./AppLinkButton.module.css";
import logo from "../assets/logo.png";

export interface IAppLinkButtonProps {
    link: string | null;
    children: JSXElement;
    class?: string;

    onClick?: (link: string) => boolean | void;
}

export function AppLinkButton(props: IAppLinkButtonProps) {
    const buttonClass = () =>
        `${styles.button}${props.class === undefined ? "" : ` ${props.class}`}`;

    const handleLinkClicked = (event: Event) => {
        const { link } = props;

        if (link === null || props.onClick?.(link) === false) {
            event.preventDefault();
        }
    };

    return (
        <a
            class={buttonClass()}
            href={props.link ?? undefined}
            target="_blank"
            onClick={handleLinkClicked}
        >
            <div class={styles.logoContainer}>
                <img class={styles.logo} src={logo} alt="Auth Armor App" />
            </div>
            <p class={styles.label}>{props.children}</p>
        </a>
    );
}
