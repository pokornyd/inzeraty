const createElement = (type, className, textContent) => {
  const element = document.createElement(type);
  element.className = className;
  if (textContent) element.textContent = textContent;
  return element;
};

const generateOffer = async () => {
  const urls = document
    .getElementById("urls")
    .value.replace(/\s/g, ",")
    .split(",");

    const getProductImages = async (imageUrls, productName) => {
      try {
        const response = await fetch("/get-product-images", {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ urls: imageUrls }),
        });
    
        const data = await response.arrayBuffer();
        const blob = new Blob([data], { type: "application/zip" });
    
        const a = document.createElement("a");
        a.style.display = "none";
        document.body.appendChild(a);
        
        const url = window.URL.createObjectURL(blob);
    
        a.href = url;
        a.download = productName;  // Name of the downloaded file
        a.click();
    
        // Cleanup
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };
    

  try {
    const response = await fetch("/fetch-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ urls }),
    });

    const data = await response.json();
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    data.forEach((item, i) => {
      const codeBox = createElement("div", "codeBox");
      const jsonArea = createElement("div", "flexArea");
      const copyArea = createElement("div", "flexArea centered");
      const copyAreaCaption = createElement("h3", null, "Kopírovat:");
      const textAreaCaption = createElement("h3", null, "JSON:");
      const textArea = createElement("textarea", "textArea");
      const generateArea = createElement("div", null);
      //const generateCaption = createElement("h3", null, "Vygenerovat:");
      const sezCheckbox = createElement("input", null, null);
      const bazCheckbox = createElement("input", null, null);
      const push = createElement("div", "push", null);

      sezCheckbox.id = i + "_sez";
      bazCheckbox.id = i + "_baz";
      sezCheckbox.type = "checkbox";
      bazCheckbox.type = "checkbox";

      const sezCheckboxLabel = createElement("label", null, "Seznam");
      const bazCheckboxLabel = createElement("label", null, "Bazos");

      sezCheckboxLabel.for = sezCheckbox.id;
      bazCheckboxLabel.for = bazCheckbox.id;

      textArea.value = JSON.stringify(item, null, 2);

      const copyDescriptionButton = createElement(
        "button",
        "button copyButton",
        "Popis"
      );
      copyDescriptionButton.onclick = () =>
        navigator.clipboard.writeText(item.offerText);

      const copyNameButton = createElement(
        "button",
        "button copyButton",
        "Název"
      );
      copyNameButton.onclick = () =>
        navigator.clipboard.writeText(item.productName);

      const copyPriceButton = createElement(
        "button",
        "button copyButton",
        "Cena"
      );
      copyPriceButton.onclick = () => navigator.clipboard.writeText(item.price);

      const downloadImagesButton = createElement(
        "button",
        "button imagesButton",
        "Stáhni obrázky"
      );
      downloadImagesButton.onclick = () => getProductImages(item.imageUrls, item.productNumber);

      const bazosGenerateButton = createElement(
        "button",
        "button bazButton",
        "Bazoš"
      );
      bazosGenerateButton.onclick = () =>
        navigator.clipboard.writeText(processOfferForBazos(item, i));

      const sBazarGenerateButton = createElement(
        "button",
        "button sezButton",
        "Seznam"
      );
      sBazarGenerateButton.onclick = () =>
        navigator.clipboard.writeText(processOfferForSbazar(item, i));

      generateArea.append(
        bazosGenerateButton,
        sBazarGenerateButton,
        downloadImagesButton,
      );

      jsonArea.append(textArea, generateArea);

      copyArea.append(
        copyAreaCaption,
        copyNameButton,
        copyDescriptionButton,
        copyPriceButton,
        push,
        sezCheckbox,
        sezCheckboxLabel,
        bazCheckbox,
        bazCheckboxLabel
      );

      codeBox.append(textAreaCaption, jsonArea, copyArea);

      resultsDiv.appendChild(codeBox);
    });
  } catch (error) {
    console.error("An error occurred:", error);
  }
};
