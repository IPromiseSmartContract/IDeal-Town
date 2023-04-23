<script setup lang="ts">
import Button from 'primevue/button'
import Menubar from 'primevue/menubar'
import { useWalletStore } from '@/stores/wallet'
import { ref, inject } from 'vue'
import { truncateAddress } from '@/utils/address'
import LogoSvg from '@/components/icons/LogoSvg.vue'
import { useRouter } from 'vue-router'
import type { LoginOptActions, LoginOptState } from '@/utils/types'
const { showLoginOpt, toggleLogin } = inject<LoginOptActions & LoginOptState>('dialog')!

const router = useRouter()
const walletStore = useWalletStore()
const items = ref([
    {
        label: 'Demo',
        icon: 'pi pi-fw pi-pencil',
        command: () => {
            window.location.assign(
                'https://drive.google.com/drive/folders/15a796WD9VL8VZorJGnAbeT5JNJcDSR4W'
            )
        }
        // items: []
    },
    {
        label: 'Presentations',
        icon: 'pi pi-fw pi-user',
        command: () => {
            window.location.assign('https://www.youtube.com/watch?v=XlFkdp0Oelk')
        }
    },
    {
        label: 'Deck',
        icon: 'pi pi-fw pi-file',
        command: () => {
            window.location.assign(
                'https://docs.google.com/presentation/d/1Eq-q3MbA7IiGeueKUIwdZ7cA1c9I-AwlctbQnGYBWYI/edit#slide=id.g21d34bde5a4_3_433'
            )
        }
    },
    {
        label: 'Govern',
        icon: 'pi pi-fw pi-building',
        items: [
            {
                label: 'Proposal',
                icon: 'pi pi-fw pi-file-edit',
                command: () => {
                    router.push('/dao/proposal')
                }
            }
        ]
    }
])
</script>

<template>
    <Menubar
        :model="items"
        class="gap-4 navbar"
        style="
            background-color: inherit;
            padding: 20px 10px 20px 10px;
            font-family: 'Allerta Stencil';
        "
    >
        <template #start>
            <LogoSvg
                style="cursor: pointer"
                :width="40"
                :height="40"
                alt="logo"
                @click="router.push('/')"
            />
        </template>
        <template #end>
            <Button
                style="
                    background-color: rgba(70, 58, 58, 1);
                    border: 0;
                    color: #eebc63;
                    font-family: 'Allerta Stencil';
                "
                @click="toggleLogin"
                >{{
                    walletStore.address ? truncateAddress(walletStore.address) : 'Connect Wallet'
                }}</Button
            >
        </template>
    </Menubar>
</template>
<style scoped>
:deep(.p-menubar-end) {
    margin-left: 2px;
}

.navbar {
    border: 0px;
    border-radius: 0px;
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    flex-direction: row;
    justify-content: space-between;
}

:deep(.p-menubar-root-list) {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
</style>
