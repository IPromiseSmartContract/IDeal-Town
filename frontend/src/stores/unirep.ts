import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { UserState, schema,Synchronizer, } from '@unirep/core'
import { defaultProver } from '@unirep/circuits/provers/defaultProver'
import { Identity } from '@semaphore-protocol/identity'
import { DB, IndexedDBConnector } from 'anondb/web'
import { useWalletStore } from './wallet'

export const useUnirepStore = defineStore("unirep", ()=>{
    const id = ref<Identity | null>(null);
    const userState = ref<UserState | null>(null)
    const walletStore = useWalletStore()

    const connect = async (projectAddress: string, unirepAddress: string) => {
        const _id = new Identity();
        const _db:DB = await IndexedDBConnector.create(schema)
        const _synchronizer = new Synchronizer({
            db: _db,
            attesterId: BigInt(projectAddress),
            prover: defaultProver,
            unirepAddress: unirepAddress,
            provider: walletStore.provider as any,
        })
        await _synchronizer.start()
        await _synchronizer.waitForSync()
        const _userState = new UserState(_synchronizer,_id)
        id.value = _id
        userState.value = _userState 
    }
    const isConnected = computed(() =>!!id.value &&!!userState.value)

    const registerDeveloper = async () => {
        if(!isConnected){
            alert("Please use unirepStore.connect before registering")
            return
        }
        const proof = await userState.value?.genUserSignUpProof()
    }

    return { id, userState, connect, isConnected }
})