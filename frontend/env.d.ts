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
    readonly VITE_UNIREP_ADDRESS: string
    readonly VITE_DAO_ADDRESS: string
    readonly VITE_IDT_ADDRESS: string
    readonly VITE_PROJECT_FACTORY_ADDRESS: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}