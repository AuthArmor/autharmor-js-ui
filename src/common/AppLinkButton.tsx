import { JSXElement } from "solid-js";
import styles from "./AppLinkButton.module.css";
import logo from "../assets/logo.png";

export interface IAppLinkButtonProps {
    link: string;
    children: JSXElement;
    class?: string;

    onClick?: () => boolean | void;
}

export function AppLinkButton(props: IAppLinkButtonProps) {
    const buttonClass = () =>
        `${styles.button}${props.class === undefined ? "" : ` ${props.class}`}`;

    const handleLinkClicked = (event: Event) => {
        if (props.onClick?.() === false) {
            event.preventDefault();
        }
    };

    return (
        <a class={buttonClass()} href={props.link} target="_blank" onClick={handleLinkClicked}>
            <img class={styles.logo} src={logo} alt="Auth Armor App" />
            <p class={styles.label}>{props.children}</p>
        </a>
    );
}
