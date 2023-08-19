import { JSX, createMemo } from "solid-js";
import qrcode from "qrcode-generator";

export type QrCodeProps = {
    data: string;

    class?: string;
    style?: string | JSX.CSSProperties;
};

export function QrCode(props: QrCodeProps) {
    const qrCodeRef = createMemo(() => {
        const codeRef = qrcode(0, "L");

        codeRef.addData(props.data);
        codeRef.make();

        return codeRef;
    });

    const qrCodeSize = () => qrCodeRef().getModuleCount();

    const qrCodeSvgPathData = createMemo(() =>
        [...Array(qrCodeSize()).keys()]
            .flatMap((row) =>
                [...Array(qrCodeSize()).keys()]
                    .filter((column) => qrCodeRef().isDark(row, column))
                    .map((column) => `M${column},${row}l1,0 0,1 -1,0,0,-1z`)
            )
            .join(" ")
    );

    return (
        <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox={`0 0 ${qrCodeSize()} ${qrCodeSize()}`}
            preserveAspectRatio="xMinYMin meet"
            class={props.class}
            style={props.style}
        >
            <path d={qrCodeSvgPathData()} stroke="transparent" fill="currentColor" />
        </svg>
    );
}
