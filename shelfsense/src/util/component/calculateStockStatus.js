const calculateStatus = (stock, safetyStock, safetyStockROP) => {
    const median = (safetyStock + safetyStockROP) / 2;

    if (stock > safetyStockROP) {
        return 4;
    } else if (stock <= safetyStock) {
        return 1;
    } else if (stock <= median) {
        return 2;
    } else {
        return 3;
    }
};

export default calculateStatus;