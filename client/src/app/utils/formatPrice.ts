export const priceWithCommas = (price: string) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
