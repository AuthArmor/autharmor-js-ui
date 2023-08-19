import { JSXElement } from "solid-js";
import styles from "./ModalContainer.module.css";

export type ModalContainerProps = {
    children: JSXElement;
};

export function ModalContainer(props: ModalContainerProps) {
    return (
        <div class={styles.backdrop}>
            <div class={styles.content} role="dialog" aria-modal>
                {props.children}
            </div>
        </div>
    );
}
