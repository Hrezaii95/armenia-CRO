# Armenia life sciences marketplace: first product slice

## Intent and scope

The user wants a commercially plausible Armenia focused discovery and workflow platform for CROs, research centers, manufacturers, and adjacent medtech, pharma, and cosmetic services. Success for this first slice is a polished, functioning public demo plus a decision ready business plan. The long term ambition includes provider profiles, international buyer discovery, comparisons, and agentic assistance. The first release focuses on finding and contacting a qualified provider. It does not claim to verify providers or execute regulated scientific work.

## Evidence and trust boundary

The supplied Drive folder and an earlier project chat are not accessible in this runtime. The current checkout and its remote have no commits or source. Demo entries must therefore be explicitly fictional. No accreditation, GMP, GCP, clinical trial, manufacturing, or regulatory claim is implied. Research and financial figures in the business plan are hypotheses until primary sources and interviews are checked. A real launch requires provider consent, source links for every claim, claim review dates, and a correction route.

## User journey

An overseas or Armenian buyer lands on an editorial home page, searches by service and segment, filters provider cards, compares up to three, opens a detailed profile, and drafts a structured inquiry. The inquiry assistant asks about service, stage, project scope, timing, and contact details, then produces a draft the buyer can copy. The demo does not send or store inquiries. A provider sees the kind of profile that can be claimed and kept current. The interface works on mobile and desktop and supports keyboard navigation.

## Product architecture

Static HTML, CSS, and JavaScript with no build dependencies. One in-repository data module holds fictional providers and service tags. One application module handles search, filters, comparison, profile detail, and inquiry drafting. External content and credential dependent AI are deferred. A later backend can add verified profiles, permissions, RFQ delivery, audit logs, and AI tools without changing the buyer flow.

## Commercial wedge

Start with CRO and analytical/research services, where international discovery and qualification are painful and a few high quality profiles can create value. Include manufacturing, medtech and cosmetics as discoverable categories only after supply interviews confirm demand and claim standards. Offer free basic listings, paid verified profile operations and buyer RFQ workflow. Keep ranking independent of payment. Later provider AI workspaces require explicit data controls and human review.

## Demo acceptance

- A user can search and filter providers, open a profile, and compare selected profiles.
- A user can complete the inquiry flow and copy a structured draft without a backend.
- Every provider is visibly identified as illustrative, and the inquiry is visibly unsent.
- The page is responsive, keyboard usable, and loads without third party network calls.
- Local HTTP startup and a functional smoke check pass.

## Deployment and next validation

If repository write access and public Pages hosting are available, publish the static build there. Otherwise keep the verified local demo and state the specific publication blocker. Replace fictional data only after documents are accessible, companies approve their profiles, and claims have sources. Validate pricing and market size through buyer and provider interviews before committing to commercial forecasts.
