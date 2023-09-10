import { JSDOM } from "jsdom";

const macbookarnaElementIdentifiers = {
  name: ".c716.c1335",
  body: ".c89",
  price: ".c2009",
  images: ".c721",
  productNumber: ".c767",
};

const osobniOdber =
  "- Osobní odběr: Brno/Praha/Olomouc nebo dle domluvy v jiném místě ČR/SK ZDARMA.\\n \\n";
const paymentInfo = [
  "\\n\\n- Záruka: 12 měsíců (reklamace vyřizujeme do 30 dnů) + 30 dnů na vrácení nebo výměnu zboží bez udání důvodu.\\n",
  "- Doprava/platba: Česká pošta (do 48h) a DPD kurýr (do 72h) ZDARMA. Platba převodem nebo na dobírku.\\n",
  "- Výkup/Protiúčet: Možnost výkupu nebo protiúčtu Vašeho starého MacBooku (i nefunkčního). Také nám lze nabídnout na protiúčet Vaše staré zařízení za zvýhodněnou cenu.\\n",
];

const postalCode = 60200;

const fetchPageContents = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const text = await response.text();
    return text;
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

const getCategoryNumber = (product) => {
  const lowerCasedProduct = product.toLowerCase();
  if (lowerCasedProduct.includes("macbook")) return 10; // notebooky
  if (lowerCasedProduct.includes("imac")) return 12; // pcs
  if (lowerCasedProduct.includes("ipad")) return 24; // tablety

  return 0; // nic (vyber kategorii)
};

export const getProductValues = async (url) => {
  const pageHtml = await fetchPageContents(url);
  const dom = new JSDOM(pageHtml);
  const document = dom.window.document;

  const rawProductName = document.querySelector(
    macbookarnaElementIdentifiers.name
  ).textContent;

  const productName =
    "ZÁRUKA: " + rawProductName;

  // const sanitizedProductName = rawProductName.replace(/[^\w]/g, "_");

  const bodyElement = Array.from(
    document.querySelector(macbookarnaElementIdentifiers.body).children
  ).find((element) => element.tagName === "P");

  bodyElement.querySelectorAll("br").forEach((br) => {
    br.replaceWith("\\n");
  });

  const body = bodyElement.textContent;

  const price = document
    .querySelector(macbookarnaElementIdentifiers.price)
    .textContent.trim()
    .replace(/\s*Kč/, "")
    .split(" ")
    .join("");

  const productNumber = document
    .querySelector(macbookarnaElementIdentifiers.productNumber)
    .textContent

  const baseUrl = "https://www.macbookarna.cz";
  const imageTags = Array.from(
    document
      .querySelector(macbookarnaElementIdentifiers.images)
      .getElementsByTagName("img")
  );

  const imageUrls = [...new Set(imageTags.map((tag) => baseUrl + tag.src))];
  const offerText = osobniOdber.concat(body, ...paymentInfo);
  const categoryNumber = getCategoryNumber(productName);

  return {
    productNumber,
    productName,
    price,
    offerText,
    categoryNumber,
    postalCode,
    imageUrls,
  };
};
