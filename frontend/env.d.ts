/// <reference types="vite/client" />
import { MetaMaskInpageProvider } from "@metamask/providers";

declare global {
    interface Window {
        ethereum?: MetaMaskInpageProvider,
    }
}

interface ImportMetaEnv {
    readonly VITE_API_KEY: string
    readonly VITE_AUTHTOKEN: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}