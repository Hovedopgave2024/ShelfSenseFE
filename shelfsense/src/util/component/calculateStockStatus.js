const calculateStatus = (stock, safetyStock, stockROP) => {
    const median = Math.floor((safetyStock + stockROP) / 2); // Calculate the median

    if (stock > stockROP) {
        return 4;
    } else if (stock <= safetyStock) {
        return 1;
    } else if (stock <= median) { // stock > safetyStock is implied
        return 2;
    } else { // stock > median && stock <= stockROP
        return 3;
    }
};

export default calculateStatus;