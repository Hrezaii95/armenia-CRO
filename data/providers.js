// Registry-backed seed checked 2026-10-02. These entries document published
// study-site or GMP-list records. They do not imply a commercial service offer,
// independently verified capabilities, languages, or exact site coordinates.
const yerevan = { hy: "Երևան", ru: "Ереван", en: "Yerevan" };
const gyumri = { hy: "Գյումրի", ru: "Гюмри", en: "Gyumri" };
const abovyan = { hy: "Աբովյան", ru: "Абовян", en: "Abovyan" };
const domesticGmp = "http://www.pharm.am/attachments/article/9608/GMP%20certificates_arm_2.pdf";
const eaeuGmp = "http://www.pharm.am/attachments/article/5966/EUAU%20GMP%20INSPECTION%20DATABASE_1.xlsx";

function studySite(id, name, nct, topic) {
  const names = typeof name === "string" ? { hy: name, ru: name, en: name } : name;
  return {
    id, sector: "research", name: names, city: yerevan,
    summary: {
      hy: `ClinicalTrials.gov-ի ${nct} գրանցման մեջ ${names.hy} նշված է որպես Երևանում ${topic.hy} վայր։`,
      ru: `В записи ClinicalTrials.gov ${nct} организация ${names.ru} указана как площадка в Ереване для ${topic.ru}.`,
      en: `ClinicalTrials.gov lists ${names.en} as a Yerevan site for ${topic.en} (${nct}).`
    },
    services: {
      hy: [`Հետազոտության վայրի գրանցում՝ ${nct}`],
      ru: [`Запись об исследовательской площадке: ${nct}`],
      en: [`Study-site listing: ${nct}`]
    },
    sourceUrl: `https://clinicaltrials.gov/study/${nct}`,
    sourceChecked: "2026-10-02", sourceType: "clinicaltrials"
  };
}

function domesticManufacturer(id, name, city, row, expiryNumeric, expiryEnglish) {
  return {
    id, sector: "manufacturing", name, city,
    summary: {
      hy: `ՀՀ կարգավորողի ՊԱԳ հավաստագրեր ստացած արտադրողների ցանկի ${row}-րդ տողում նշված է ${city.hy} քաղաքի արտադրամասը։ Հավաստագրի վերջնաժամկետը՝ ${expiryNumeric}։`,
      ru: `В строке ${row} армянского перечня производителей с сертификатами GMP указана площадка в городе ${city.ru}. Срок действия — до ${expiryNumeric}.`,
      en: `Row ${row} of Armenia’s regulator list of manufacturers with GMP certificates names a ${city.en} site; listed validity ends ${expiryEnglish}.`
    },
    services: {
      hy: ["ՊԱԳ հավաստագրերի ցանկում արտադրողի գրանցում"],
      ru: ["Запись производителя в перечне сертификатов GMP"],
      en: ["Manufacturer entry in GMP certificate list"]
    },
    sourceUrl: domesticGmp, sourceChecked: "2026-10-02", sourceType: "gmp"
  };
}

function eaeuManufacturer(id, name, city, certificate, expiryNumeric, expiryEnglish) {
  return {
    id, sector: "manufacturing", name, city,
    summary: {
      hy: `ՀՀ կարգավորողի ԵԱՏՄ ՊԱԳ տվյալների բազայում ${city.hy} քաղաքի արտադրամասի կարգավիճակը CURRENT է։ ${certificate} հավաստագրի վերջնաժամկետը՝ ${expiryNumeric}։`,
      ru: `В базе ЕАЭС GMP армянского регулятора площадка в городе ${city.ru} имеет статус CURRENT. Срок сертификата ${certificate} — до ${expiryNumeric}.`,
      en: `Armenia’s regulator EAEU GMP database lists its ${city.en} manufacturing site as CURRENT; certificate ${certificate} expires ${expiryEnglish}.`
    },
    services: {
      hy: ["ԵԱՏՄ ՊԱԳ տվյալների բազայում արտադրամասի գրանցում"],
      ru: ["Запись производственной площадки в базе ЕАЭС GMP"],
      en: ["Manufacturing-site entry in EAEU GMP database"]
    },
    sourceUrl: eaeuGmp, sourceChecked: "2026-10-02", sourceType: "gmp"
  };
}

export const providers = [
  studySite("tonus-les-clinical-site", '"Tonus-Les" LLC', "NCT07156916", {
    hy: "տամսուլոզինի համեմատական կենսամատչելիության հետազոտության",
    ru: "сравнительного исследования биодоступности тамсулозина",
    en: "a comparative bioavailability study of tamsulosin"
  }),
  studySite("erebouni-medical-center", "Erebouni Medical Center", "NCT06748924", {
    hy: "քրոնիկ կորոնար համախտանիշի հետազոտության",
    ru: "исследования хронического коронарного синдрома",
    en: "the Chronic Coronary Syndrome Snapshot Study"
  }),
  studySite("yeolyan-hematology-center", "Hematology Center named after prof. R. Yeolyan", "NCT05711992", {
    hy: "ԿՆՀ հազվադեպ սաղմնային ուռուցքների միջազգային ռեեստրի հետազոտության",
    ru: "исследования международного регистра редких эмбриональных опухолей ЦНС",
    en: "an international registry of rare embryonal tumors of the central nervous system"
  }),
  studySite("malayan-ophthalmological-center", "Ophthalmological Center After S.V. Malayan", "NCT06659549", {
    hy: "GAL-101 ակնային լուծույթի հետազոտության",
    ru: "исследования офтальмологического раствора GAL-101",
    en: "a study of GAL-101 ophthalmic solution"
  }),
  studySite("national-institute-infectious-diseases", "National Institute for Infectious Diseases", "NCT06159504", {
    hy: "հեպատիտ C-ի խնամքի ուղիների հետազոտության",
    ru: "исследования маршрутов помощи при гепатите C",
    en: "a study of hepatitis C care pathways"
  }),
  domesticManufacturer("alfa-pharm", {
    hy: "«Ալֆա-Ֆարմ» ՓԲԸ", ru: "Alfa-Pharm CJSC", en: "Alfa-Pharm CJSC"
  }, gyumri, 6, "12.05.2027", "12 May 2027"),
  domesticManufacturer("pharmatech", {
    hy: "«Ֆարմատեք» ՓԲԸ", ru: "Pharmatech CJSC", en: "Pharmatech CJSC"
  }, yerevan, 8, "21.10.2027", "21 October 2027"),
  domesticManufacturer("a-lab-pharmaceuticals", {
    hy: "«Էյ Լաբ Ֆարմասյութիքալս» ՍՊԸ", ru: "A Lab Pharmaceuticals LLC", en: "A Lab Pharmaceuticals LLC"
  }, yerevan, 9, "05.11.2027", "5 November 2027"),
  eaeuManufacturer("liqvor", {
    hy: "«Լիկվոր» ՓԲԸ", ru: "LIQVOR CJSC", en: "LIQVOR CJSC"
  }, yerevan, "GMP/EAEU/AM/00015/2024", "11.12.2027", "11 December 2027"),
  eaeuManufacturer("arpimed", {
    hy: "“ARPIMED” LLC", ru: "“ARPIMED” LLC", en: "“ARPIMED” LLC"
  }, abovyan, "GMP/EAEU/AM/000014/2026", "03.06.2027", "3 June 2027")
];

export const categories = ["all", "cro", "research", "analytical", "manufacturing", "medtech", "cosmetics"];
