import { JSX, splitProps } from "solid-js";
import cn from "clsx";
import styles from "./ButtonFormControl.module.css";
import formControlStyles from "./FormControl.module.css";

export type ButtonFormControlProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
    class?: string;
};

export function ButtonFormControl(_props: ButtonFormControlProps) {
    const [props, passthroughProps] = splitProps(_props, ["class"]);

    return (
        <button
            class={cn(formControlStyles.control, styles.button, props.class)}
            {...passthroughProps}
        />
    );
}
