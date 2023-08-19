import { JSX, splitProps } from "solid-js";
import cn from "clsx";
import styles from "./InputFormControl.module.css";
import formControlStyles from "./FormControl.module.css";

export type InputFormControlProps = JSX.InputHTMLAttributes<HTMLInputElement> & {
    class?: string;
};

export function InputFormControl(_props: InputFormControlProps) {
    const [props, passthroughProps] = splitProps(_props, ["class"]);

    return (
        <input
            class={cn(formControlStyles.control, styles.input, props.class)}
            {...passthroughProps}
        />
    );
}
