import { createMemo } from "solid-js";
import qrcode from "qrcode-generator";
// import { QRCodeToDataURLOptions, toDataURL } from "qrcode";

// const qrCodeOptions: QRCodeToDataURLOptions = {
//     margin: 1,
//     color: {
//         light: "#202020FF",
//         dark: "#2CB2B5FF"
//     }
// };

export interface IQrCodeProps {
    data: string;
    class?: string;
}

export function QrCode(props: IQrCodeProps) {
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
            class={props.class}
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox={`0 0 ${qrCodeSize()} ${qrCodeSize()}`}
            preserveAspectRatio="xMinYMin meet"
        >
            <path d={qrCodeSvgPathData()} stroke="transparent" fill="currentColor" />
        </svg>
    );
}
