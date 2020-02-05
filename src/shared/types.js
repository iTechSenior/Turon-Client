export const getPaymentStatus = (id) => {
    switch(id){
        case 1: return 'Pending';
        case 2: return 'Available';
        case 3: return 'Completed';
        default: return 'Unknown';
    }
}