const calculateStatus = (stock, safetyStock, safetyStockROP) => {
    const median = (safetyStock + safetyStockROP) / 2;

    console.log("stock: " + stock);
    console.log("safetyStock: " + safetyStock);
    console.log("safetyStockROP: " + safetyStockROP);

    if (!stock || !safetyStock || !safetyStockROP) {
        return 0;
    }

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