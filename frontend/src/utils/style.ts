
export const getStatusStyle = (status: string) => {
    switch (status) {
        case 'completed':
            return {
                backgroundImage: 'linear-gradient(120deg, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)'
            }
        case 'active':
            return {
                backgroundImage: 'linear-gradient(120deg, rgba(252,70,107,1) 0%, rgba(63,94,251,1) 100%)'
            }
        case 'inactive':
            return {
                backgroundImage: 'linear-gradient(120deg, rgba(0,0,0,1) 0%, rgba(10,50,100,1) 100%)'
            }
        default:
            return {}
    }
}