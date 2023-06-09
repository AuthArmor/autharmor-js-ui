export const isMobile =
    "userAgentData" in navigator
        ? (navigator["userAgentData"] as { mobile: boolean }).mobile
        : false;
