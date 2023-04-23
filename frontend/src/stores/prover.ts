//@ts-ignore
import * as snarkjs from 'snarkjs'
//@ts-ignore
import { SnarkPublicSignals, SnarkProof } from '@unirep/crypto'
import { Circuit } from '@unirep/circuits'

const getVKey =  async (circuitName: string):Promise<string> => {
    const url = new URL(`http://localhost:5173/zksnarkBuild/${circuitName}.vkey.json`)
    const vkey = await fetch(url.toString()).then((r) => r.json())
    return vkey
}

export default {
    verifyProof: async (
        circuitName: string | Circuit,
        publicSignals: SnarkPublicSignals,
        proof: SnarkProof
    ) => {
        const vkey = await getVKey(circuitName)
        return snarkjs.groth16.verify(vkey, publicSignals, proof)
    },
    genProofAndPublicSignals: async (
        circuitName: string | Circuit,
        inputs: any
    ) => {
        const wasmUrl = new URL(`http://localhost:5173/zksnarkBuild/${circuitName}.wasm`)
        const wasm = await fetch(wasmUrl.toString()).then((r) =>
            r.arrayBuffer()
        )
        const zkeyUrl = new URL(`http://localhost:5173/zksnarkBuild/${circuitName}.zkey`)
        const zkey = await fetch(zkeyUrl.toString()).then((r) =>
            r.arrayBuffer()
        )
        const { proof, publicSignals } = await snarkjs.groth16.fullProve(
            inputs,
            new Uint8Array(wasm),
            new Uint8Array(zkey)
        )
        return { proof, publicSignals }
    },
    getVkey: getVKey,
}