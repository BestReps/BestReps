export const staticProducts = [
  {
    name: "airforce one",
    price_usd: "$13",
    image_url:
      "https://lh7-rt.googleusercontent.com/sheetsz/AHOq17GPbpPR9U63iaaG8yPJDjVdVSS640_cYFzS6vP7-0yTM0ZDv_3pyhEsdDVdB7VUKgRUpTIlem52UhGCjI7LptLBA_TlwiBwKwedtyGV4Ie6g2WSK4BozeDQvDQdN3_Gm9ndqXqcIw=w204-h163?key=p2g3-rzV9ITo2xi2WG5U_ZHr",
    link: "https://cnfans.com/product/?shop_type=weidian&id=7240332207&ref=201196",
    category: "other",
  },
  {
    name: "airforce one mulitiple colour ways",
    price_usd: "$30",
    image_url:
      "https://lh7-rt.googleusercontent.com/sheetsz/AHOq17G1bjriR0FrMFBTOetvjlw0pVHg00uRAYeutTB--U-sbyPkycOYDLTDUwOsYuRcwfXHA3FjJKIDM3U89z2IMgX_E8lCxgL0WfQ-bWhmbayKVU_NYiuWK7jw6g0eGy2PTmxBMAJYPw=w204-h149?key=p2g3-rzV9ITo2xi2WG5U_ZHr",
    link: "https://cnfans.com/product/?shop_type=weidian&id=7240332207&ref=201196",
    category: "other",
  },
  {
    name: "resell batch jordan 4",
    price_usd: "$27",
    image_url:
      "https://lh7-rt.googleusercontent.com/sheetsz/AHOq17FwT3QhtVTtoA5gp2oPNgjLBzBitpaj9t24bSaeamxZ-HYcm1rWUeCdHkcOFVNoNhBRKzGM8CTmYPISC9dB2VljvXJtXTgH0hGMT9Dis3rADG4I7PcrbulkkL47UrFVrAn0RYwy=w204-h149?key=p2g3-rzV9ITo2xi2WG5U_ZHr",
    link: "https://cnfans.com/product/?shop_type=weidian&id=7264688429&ref=201196",
    category: "shoes",
  },
];

export async function fetchProductData() {
  const response = await fetch("data_cat.json");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}
