const processOfferForBazos = (offerObject, index) => {
  const bazosElementIds = {
    name: "nadpis",
    category: "category",
    description: "popis",
    price: "cena",
    postal: "lokalita",
  };

  const { productName, price, offerText, categoryNumber, postalCode } =
    offerObject;

  document.getElementById(index + "_baz").checked = true;

  return `const populate = () => { document.getElementById('${bazosElementIds.name}').value = '${productName}'; document.getElementById('${bazosElementIds.description}').value = '${offerText}'; document.getElementById('${bazosElementIds.price}').value = '${price}'; document.getElementById('${bazosElementIds.category}').value = '${categoryNumber}'; document.getElementById('${bazosElementIds.postal}').value = '${postalCode}' }; populate()`;
};
