export interface IUiOptions {
    form?: IFormUiOptions;
    dialog?: IDialogUiOptions;
}

export interface IFormUiOptions {
    borderRadius?: string;
    controlBorderRadius?: string;
    fontFamily?: string;
    backgroundColor?: string;
    methodPromptForegroundColor?: string;
    methodInstructionsForegroundColor?: string;
    methodSeparatorForegroundColor?: string;
    errorForegroundColor?: string;
    tabBackgroundColor?: string;
    tabForegroundColor?: string;
    tabHoverBackgroundColor?: string;
    tabHoverForegroundColor?: string;
    tabActiveBackgroundColor?: string;
    tabActiveForegroundColor?: string;
    qrCodeBackgroundColor?: string;
    qrCodeForegroundColor?: string;
    inputBackgroundColor?: string;
    inputForegroundColor?: string;
    buttonBackgroundColor?: string;
    buttonForegroundColor?: string;
    buttonHoverBackgroundColor?: string;
    buttonHoverForegroundColor?: string;
}

export interface IDialogUiOptions {
    borderRadius?: string;
    controlBorderRadius?: string;
    fontFamily?: string;
    backdropColor?: string;
    backgroundColor?: string;
    closeButtonBackgroundColor?: string;
    closeButtonForegroundColor?: string;
    closeButtonHoverBackgroundColor?: string;
    closeButtonHoverForegroundColor?: string;
    buttonBackgroundColor?: string;
    buttonForegroundColor?: string;
    buttonForegroundAccentColor?: string;
    buttonForegroundAuxiliaryColor?: string;
    buttonHoverBackgroundColor?: string;
    buttonHoverForegroundColor?: string;
    methodSelectorTitleForegroundColor?: string;
    statusTitleForegroundColor?: string;
    statusMessageWaitingBackgroundColor?: string;
    statusMessageWaitingForegroundColor?: string;
    statusMessageSuccessBackgroundColor?: string;
    statusMessageSuccessForegroundColor?: string;
    statusMessageErrorBackgroundColor?: string;
    statusMessageErrorForegroundColor?: string;
    statusMessagePulserForegroundColor?: string;
    qrCodeBackgroundColor?: string;
    qrCodeForegroundColor?: string;
    qrCodePromptForegroundColor?: string;
    qrCodeTogglerBackgroundColor?: string;
    qrCodeTogglerForegroundColor?: string;
    qrCodeTogglerHoverBackgroundColor?: string;
    qrCodeTogglerHoverForegroundColor?: string;
}
