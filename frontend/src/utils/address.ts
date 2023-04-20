export function truncateAddress(address: string, length: number = 5) {
    return `${address.slice(0, length + 2)}...${address.slice(-length)}`;
}
