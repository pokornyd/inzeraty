const processOfferForSbazar = (offerObject, index) => {
    const sBazarElementIds = {
        name: "name",
        description: "description",
        price: "price",
    }

    const { productName, price, offerText } = offerObject;

    document.getElementById(index + "_sez").checked = true;

    return `const populate = () => { document.getElementById('${sBazarElementIds.name}').value = '${productName}'; document.getElementById('${sBazarElementIds.description}').value = '${offerText}'; document.getElementById('${sBazarElementIds.price}').value = '${price}'}; populate()`;
}