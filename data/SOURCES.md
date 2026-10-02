# Provider source policy

The public index contains real organizations only. Each claim must be traceable to a directly opened primary source: the organization's own website, an official Armenian regulator document, or an official clinical-study registry record. A registry-backed profile describes only the fact recorded there. A listed trial site is **not** labeled a commercial CRO; a manufacturer on a GMP list is **not** assumed to offer contract manufacturing or any specific product or service. No fictional example belongs in `providers.js`.

Each record has a stable ID, names and conservative summaries in Armenian, Russian, and English, sector, city, documented activity, `sourceType`, exact `sourceUrl`, and `sourceChecked` in `YYYY-MM-DD` form. The source type is shown on cards, profiles, and comparisons. Leave languages, accreditation, equipment, response promises, and services unstated unless the linked evidence supports them. Display names translated from a registry are editorial aids, not claimed legal names. If a source changes or disappears, review or remove the affected claim before republishing.

Use HTTPS source URLs. The only current exception is an **HTTP URL on `www.pharm.am` under `/attachments/article/`** for the Armenian drug regulator's official GMP documents: those were opened and checked on 2 October 2026, while the HTTPS versions returned an error. The app rejects other HTTP source links. Certificate expiry dates are details of the published list, not independent confirmation that a certificate remains in force today. City map markers represent cities, never a facility's street address.

The old demo's six invented companies were deleted. Automated browser checks inject separate fixture records and never publish them. Counts and map markers are computed from product records; they are not estimates of Armenia's whole life sciences market.

| Source type | What can be published from it | What still needs provider confirmation |
| --- | --- | --- |
| Organization website | Directly stated identity, location, and capabilities | Current availability, quality and regulatory commitments |
| ClinicalTrials.gov study record | Facility name, city, and its listing in the named study | Commercial CRO services, staff, equipment, active availability |
| Armenian regulator GMP list | Manufacturer name, listed site/city, document date and stated certificate end date | Contract manufacturing offering, product range, present certificate status |

For each record, keep the exact supporting URL and UTC review date. The supplied project Drive folder still redirects to Google sign-in, so its prior company analysis has not been incorporated. Provider-owned websites are also blocked by this environment's current network policy. Broader capability profiles require direct source access and provider review.
