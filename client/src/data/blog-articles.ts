export interface BlogArticle {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  tags: string[];
  heroImage: string;
  sections: ArticleSection[];
}

export interface ArticleSection {
  heading: string;
  content: string;
}

export const BLOG_ARTICLES: BlogArticle[] = [
  {
    slug: "what-is-bre470",
    title: "What Is BRE470 and Why It Matters for Piling Operations",
    metaTitle: "What Is BRE470? Guide to Working Platform Design for Piling | BRE470 Piling Mat Designer",
    metaDescription: "Learn what BRE470 (BR 470) is, why it matters for piling operations, and how it sets the standard for working platform design in the UK construction industry.",
    excerpt: "BRE470 is the UK industry standard for designing working platforms for tracked plant. Understanding this guidance is essential for every piling contractor, temporary works coordinator, and site engineer.",
    author: "David Miller",
    date: "2026-04-10",
    readTime: "8 min read",
    tags: ["BRE470", "Working Platforms", "Piling", "Standards"],
    heroImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663349554749/hMJrHrZWZ2XC9JAvjXeKjs/hero-construction-7yCmYE7gTL3hM6e2YBcmpd.webp",
    sections: [
      {
        heading: "Introduction to BRE470",
        content: `BRE470, formally titled "Working Platforms for Tracked Plant: Good Practice Guide to the Design, Installation, Maintenance and Repair of Ground-supported Working Platforms" and published by the Building Research Establishment (BRE) in 2004, is the definitive UK guidance document for the design of working platforms for tracked plant such as piling rigs, cranes, and drilling equipment.

The document, commonly referred to as BR 470, provides a systematic calculation methodology for determining the required thickness of granular working platforms placed on natural ground to safely support heavy tracked plant. It addresses both cohesive (clay/silt) and granular (sand/gravel) subgrade conditions and includes provisions for geosynthetic reinforcement.

Before BRE470, there was no standardised approach to working platform design in the UK. Contractors and designers relied on experience, rules of thumb, and ad hoc calculations that varied widely in quality and reliability. The publication of BR 470 brought consistency, safety, and professional rigour to an area of temporary works that had historically been under-engineered.`
      },
      {
        heading: "Why BRE470 Matters for Piling Contractors",
        content: `For piling contractors, BRE470 is not optional guidance — it is the expected standard of care. The Health and Safety Executive (HSE) and the Temporary Works Forum both reference BR 470 as the benchmark for working platform design. Failure to design platforms in accordance with this guidance exposes contractors to significant risks:

**Safety risks:** An inadequately designed working platform can fail under the weight of a piling rig, leading to rig instability, toppling, or ground collapse. These incidents can cause serious injury or death to operatives and bystanders. The Federation of Piling Specialists (FPS) has documented numerous incidents where platform failure led to rig overturning.

**Legal and regulatory risks:** Under the Construction (Design and Management) Regulations 2015 (CDM 2015), the principal contractor has a duty to ensure that working platforms are designed and maintained to be safe. A platform that fails because it was not designed to BRE470 would be difficult to defend in any HSE investigation or civil claim.

**Commercial risks:** Platform failure causes project delays, equipment damage, and potential claims from third parties. The cost of a properly designed platform is negligible compared to the cost of a rig recovery, project delay, or personal injury claim.

**Professional reputation:** Clients, principal contractors, and temporary works coordinators increasingly require BRE470 compliance as a contractual condition. Contractors who cannot demonstrate compliance risk losing work to competitors who can.`
      },
      {
        heading: "The BRE470 Calculation Methodology",
        content: `The core of BRE470 is Appendix A, which provides the step-by-step calculation methodology for determining platform thickness. The calculation considers:

**Subgrade conditions:** The natural ground beneath the platform is characterised by either undrained shear strength (cu) for cohesive soils or angle of shearing resistance (φ') for granular soils. These parameters are typically obtained from ground investigation data.

**Platform material properties:** The granular fill used to construct the platform is characterised by its angle of shearing resistance (φ'p) and unit weight (γp). Well-graded crushed rock typically has φ'p values of 40-45°.

**Plant loading:** The track pressures from the piling rig are the primary design load. These are expressed as maximum track pressure (q1k) under outrigger loading and slewing track pressure (q2k). EN 996 provides standardised track pressure data for common piling rigs.

**Partial factors:** BRE470 applies partial factors to both loads and material properties to achieve a safe design. The load factor (γF) is typically 1.26, and the material factor (γM) is applied to the tangent of the angle of shearing resistance.

The calculation determines the required platform thickness (T) such that the bearing pressure at the base of the platform, spread through the granular fill at an angle related to φ'p, does not exceed the bearing capacity of the subgrade.`
      },
      {
        heading: "Who Needs to Understand BRE470?",
        content: `Several key roles in the construction industry need a working knowledge of BRE470:

**Temporary Works Coordinators (TWCs):** Under BS 5975, the TWC is responsible for ensuring that all temporary works, including working platforms, are properly designed, checked, and approved before use. The TWC must understand BRE470 to review and approve platform designs.

**Temporary Works Designers (TWDs):** The designer who produces the platform calculation must be competent in the BRE470 methodology. The design must be checked by an independent checker before it can be approved by the TWC.

**Piling contractors:** The contractor installing the piling rig is typically responsible for providing the platform design. They must understand the input parameters required and ensure the platform is constructed in accordance with the design.

**Site engineers and agents:** Those responsible for day-to-day site operations must understand the platform design requirements, monitor platform condition during use, and ensure maintenance and repair are carried out as needed.

**Principal contractors:** Under CDM 2015, the principal contractor has overall responsibility for site safety, including the adequacy of working platforms.`
      },
      {
        heading: "How Our BRE470 Design Tool Helps",
        content: `Our BRE470 Piling Mat Designer automates the Appendix A calculation methodology, making it accessible to piling contractors and temporary works professionals without the need for expensive consultancy. For just £299.99 per design, you receive:

A full interpretive design with all BRE470 Appendix A calculation steps clearly presented, a professional check certificate with unique reference number signed by David Miller (Temporary Works Designer), a cross-section diagram showing the platform layers and dimensions, and instant digital delivery in a print-ready A4 format.

The tool includes 23 pre-loaded piling rigs from Liebherr, Bauer, and Soilmec with EN 996 track dimensions auto-filled, supports both cohesive and granular subgrades, and includes optional geosynthetic reinforcement.

Traditional consultancy designs cost £500–£1,000 per design and can take days to receive. Our tool delivers the same professional output in under 2 minutes at a fraction of the cost.`
      }
    ]
  },
  {
    slug: "how-to-design-working-platform",
    title: "How to Design a Working Platform to BRE470: Step-by-Step Guide",
    metaTitle: "How to Design a Working Platform to BRE470 | Step-by-Step Guide | Piling Mat Design",
    metaDescription: "Step-by-step guide to designing a working platform for piling rigs using BRE470 Appendix A methodology. Covers subgrade assessment, material selection, and thickness calculation.",
    excerpt: "A practical step-by-step guide to designing a working platform for tracked plant using the BRE470 Appendix A calculation methodology. From ground investigation to final platform thickness.",
    author: "David Miller",
    date: "2026-04-09",
    readTime: "10 min read",
    tags: ["Design Guide", "BRE470", "Appendix A", "Calculation"],
    heroImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663349554749/hMJrHrZWZ2XC9JAvjXeKjs/platform-layers-PcjvRgwvXBiEZzaTKeBrTN.webp",
    sections: [
      {
        heading: "Step 1: Assess the Subgrade Conditions",
        content: `The first step in any BRE470 working platform design is to characterise the natural ground (subgrade) on which the platform will be placed. The subgrade type determines which branch of the calculation methodology to follow.

**Cohesive subgrades (clays and silts):** These are characterised by their undrained shear strength (cu), measured in kilopascals (kPa). Typical values range from 20 kPa for soft clay to 80 kPa for stiff clay. BRE470 Table B1 provides guidance on typical cu values for different soil descriptions. The cu value should ideally come from ground investigation data — either from in-situ testing (vane shear, cone penetration tests) or laboratory testing (triaxial tests, unconfined compression tests).

**Granular subgrades (sands and gravels):** These are characterised by their angle of shearing resistance (φ'), measured in degrees. Typical values range from 25° for loose sand to 40° for dense gravel. The φ' value is usually estimated from SPT N-values or CPT cone resistance using published correlations.

If ground investigation data is not available, conservative estimates should be used. For cohesive soils, a cu of 20-40 kPa is often assumed for soft to firm clay. The designer must clearly state the assumed parameters and their basis in the design certificate.`
      },
      {
        heading: "Step 2: Select the Platform Material",
        content: `The platform material is the granular fill placed on the subgrade to form the working platform. The two key parameters are:

**Angle of shearing resistance (φ'p):** This determines how effectively the platform spreads the load from the tracked plant to the subgrade. Higher values mean better load spreading and thinner required platforms. Typical values are:
- Well-graded crushed rock: 40-45°
- Crushed concrete: 38-42°
- Gravel: 32-38°
- As-dug sand and gravel: 30-35°

BRE470 recommends using well-graded crushed rock with a minimum φ'p of 40° for best performance. The material should be angular, well-graded, and free from clay lumps, organic matter, and other deleterious material.

**Unit weight (γp):** The self-weight of the platform material, typically 18-22 kN/m³ for crushed rock. This is used in the calculation to account for the weight of the platform itself bearing on the subgrade.

**Geosynthetic reinforcement:** BRE470 allows for the use of geosynthetic reinforcement (geogrid or geotextile) at the base of the platform to improve load spreading. When reinforcement is used, the effective angle of load spread through the platform is increased, resulting in a thinner required platform. This can be economically beneficial on sites with poor subgrade conditions.`
      },
      {
        heading: "Step 3: Determine the Plant Loading",
        content: `The design load comes from the tracked plant that will operate on the platform. For piling rigs, the critical parameters are:

**Track width (W):** The width of one track shoe, typically 0.6-1.0 m for piling rigs. This defines the width of the loaded area.

**Track length — overall (L1):** The full length of the track in contact with the ground. This is used for the outrigger loading case.

**Track length — loaded (L2):** The loaded length of the track under slewing conditions. This is typically shorter than L1 as the load concentrates under the mast during slewing.

**Maximum track pressure (q1k):** The maximum ground pressure under the track during outrigger operations, in kPa. This is the most onerous loading case for many rigs.

**Slewing track pressure (q2k):** The maximum ground pressure during slewing operations, in kPa. This can be more onerous than q1k for some rig configurations.

EN 996 provides standardised track pressure data for common piling rigs. Our design tool includes 23 pre-loaded rigs from Liebherr, Bauer, and Soilmec with all parameters auto-filled from EN 996 data.`
      },
      {
        heading: "Step 4: Run the BRE470 Appendix A Calculation",
        content: `With the subgrade, platform material, and plant loading parameters defined, the BRE470 Appendix A calculation determines the required platform thickness. The calculation follows these steps:

**1. Apply partial factors:** The characteristic track pressures are multiplied by the load factor γF (typically 1.26) to obtain design track pressures. The tangent of the platform material's angle of shearing resistance is divided by the material factor γM to obtain the design angle of load spread.

**2. Calculate the spread area:** Using the design angle of load spread, the calculation determines how the track pressure spreads through the platform thickness to the subgrade surface. The spread area increases with platform thickness.

**3. Check bearing capacity:** The pressure at the subgrade surface (after spreading through the platform) must not exceed the bearing capacity of the subgrade. For cohesive subgrades, the bearing capacity is based on cu and the Nc bearing capacity factor. For granular subgrades, it is based on φ' and the Nγ bearing capacity factor.

**4. Iterate to find minimum thickness:** The calculation iterates to find the minimum platform thickness T that satisfies the bearing capacity check. The final thickness is rounded up to the nearest 25 mm for practical construction.

Our BRE470 Piling Mat Designer performs this entire calculation automatically, presenting each step clearly in the design certificate so the Temporary Works Coordinator can follow and verify the design logic.`
      },
      {
        heading: "Step 5: Document and Certify the Design",
        content: `A BRE470 working platform design is not complete until it is properly documented and certified. Under BS 5975, the design must be:

**Produced by a competent designer:** The Temporary Works Designer (TWD) must be competent in the BRE470 methodology and experienced in working platform design.

**Independently checked:** The design must be checked by an independent checker who is also competent in BRE470. The checker verifies the calculation methodology, input parameters, and results.

**Approved by the TWC:** The Temporary Works Coordinator reviews the design and check certificate, confirms the design is appropriate for the site conditions, and issues approval for construction.

**Communicated to site:** The approved design must be communicated to the site team, including the required platform thickness, material specification, and any special requirements such as geosynthetic reinforcement.

Our design certificates include all of this documentation in a single professional output: the full calculation with all parameters and steps, a cross-section diagram, and a check certificate signed by David Miller, Temporary Works Designer. This gives the TWC everything needed to review and approve the design.`
      }
    ]
  },
  {
    slug: "piling-mat-design-calculator",
    title: "Piling Mat Design Calculator: Save 50-70% vs Traditional Consultancy",
    metaTitle: "Piling Mat Design Calculator | BRE470 Certified | £299.99 | Save 50-70%",
    metaDescription: "Online piling mat design calculator with BRE470 certification. Get a professional design certificate for £299.99 — save 50-70% vs traditional consultancy fees. 23 pre-loaded rigs, instant results.",
    excerpt: "Why pay £500–£1,000 for a consultancy design when you can get the same professional BRE470 certified output for £299.99? Our piling mat design calculator delivers instant results with full certification.",
    author: "David Miller",
    date: "2026-04-08",
    readTime: "6 min read",
    tags: ["Calculator", "Cost Savings", "Piling Mat", "Design Tool"],
    heroImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663349554749/hMJrHrZWZ2XC9JAvjXeKjs/hero-construction-7yCmYE7gTL3hM6e2YBcmpd.webp",
    sections: [
      {
        heading: "The Problem with Traditional Consultancy Designs",
        content: `Every piling project requires a working platform design to BRE470. Traditionally, this means engaging a temporary works consultant to produce the calculation and certificate. The typical process involves:

**Cost:** £500–£1,000 per design, depending on the consultant and project complexity. For a piling contractor working on multiple sites simultaneously, this adds up to thousands of pounds per month in design fees alone.

**Time:** 3-7 working days turnaround is typical. Some consultants offer faster turnaround for a premium, but even "express" services take 1-2 days. This delay can hold up site mobilisation and programme.

**Communication overhead:** The contractor must brief the consultant on the site conditions, rig type, and ground investigation data. Queries and clarifications add further delay. If parameters change (different rig, updated ground investigation), the design must be re-issued.

**Inconsistency:** Different consultants use different presentation formats, levels of detail, and interpretation of the BRE470 methodology. This makes it harder for TWCs to review and compare designs across projects.

For a standard BRE470 Appendix A calculation — which follows a well-defined, deterministic methodology — this traditional approach is unnecessarily expensive and slow.`
      },
      {
        heading: "How Our Calculator Changes the Game",
        content: `Our BRE470 Piling Mat Design Calculator automates the entire Appendix A calculation and certification process. The result is a professional design certificate that is identical in quality and rigour to a traditional consultancy output, delivered in under 2 minutes for £299.99.

**Instant results:** Enter your parameters, review the calculation, and receive your certificate immediately. No waiting days for a consultant to respond.

**Consistent quality:** Every design follows the same rigorous methodology, with every calculation step clearly presented. The TWC sees exactly the same format and level of detail every time.

**23 pre-loaded piling rigs:** Select from Liebherr (LB 16 to LB 44, LRB 155, LRB 255), Bauer (BG 15 H to BG 46), and Soilmec (SR-30 to SR-100) with EN 996 track dimensions auto-filled. No need to look up rig specifications.

**Professional certification:** Every design certificate includes a unique reference number and is signed by David Miller, Temporary Works Designer at Temporary Works Consulting Ltd.

**Both subgrade types:** Full support for cohesive (clay/silt) and granular (sand/gravel) subgrades, with optional geosynthetic reinforcement.`
      },
      {
        heading: "Cost Comparison: Calculator vs Consultancy",
        content: `The savings are substantial, especially for contractors running multiple projects:

A single design costs £299.99 with our calculator versus £500–£1,000 with a traditional consultant — an immediate saving of 50-70% on every design.

For a piling contractor running 5 projects per month, the annual saving is significant. At 60 designs per year, the calculator costs £17,999 versus £30,000–£60,000 for traditional consultancy. That represents savings of £12,000–£42,000 per year.

Beyond the direct cost saving, there are indirect benefits: zero waiting time means no programme delays, consistent format means faster TWC review and approval, and the ability to run multiple design scenarios quickly means better-optimised platforms.

The calculator is particularly valuable for tender-stage designs where the contractor needs a quick, reliable estimate of platform requirements to price the works. At £299.99, it is economical to run a design at tender stage and refine it when the project is awarded.`
      },
      {
        heading: "What You Get in Every Certificate",
        content: `Every design certificate from our calculator includes:

**Section 1 — Project Details:** Project name, site location, client name, certificate reference number, and date of issue.

**Section 2 — Design Parameters:** Full tabulation of all input parameters including subgrade type and properties, platform material properties, plant loading (rig model, track dimensions, track pressures), and partial factors.

**Section 3 — Design Results:** Calculated required platform thickness (rounded to nearest 25 mm), cross-section diagram showing all layers and dimensions, and clear PASS/FAIL assessment against BRE470 criteria.

**Section 4 — Calculation Audit Trail:** Every step of the BRE470 Appendix A calculation presented in full, including factored loads, design angles, spread areas, bearing pressures, and bearing capacity checks. This allows the TWC to follow and verify every step of the design logic.

**Section 5 — Design Check Certificate:** Professional certificate with unique reference number, signed by David Miller, Temporary Works Designer, Temporary Works Consulting Ltd. Includes BRE470 compliance statement and professional disclaimer.

The entire certificate is formatted for A4 printing and can be printed directly from the browser or saved as a PDF.`
      }
    ]
  },
  {
    slug: "temporary-works-coordinator-guide",
    title: "Temporary Works Coordinator Guide to Approving Platform Certificates",
    metaTitle: "TWC Guide to Approving BRE470 Platform Certificates | Temporary Works Coordinator",
    metaDescription: "A practical guide for Temporary Works Coordinators on reviewing and approving BRE470 working platform design certificates. What to check, common issues, and best practice.",
    excerpt: "As a Temporary Works Coordinator, you need to review and approve working platform designs before piling can commence. This guide explains what to look for in a BRE470 design certificate.",
    author: "David Miller",
    date: "2026-04-07",
    readTime: "7 min read",
    tags: ["TWC", "Temporary Works", "Approval", "BS 5975"],
    heroImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663349554749/hMJrHrZWZ2XC9JAvjXeKjs/platform-layers-PcjvRgwvXBiEZzaTKeBrTN.webp",
    sections: [
      {
        heading: "The TWC's Role in Platform Design Approval",
        content: `Under BS 5975:2019 "Code of Practice for Temporary Works Procedures and the Permissible Stress Design of Falsework", the Temporary Works Coordinator (TWC) has a critical role in the management of all temporary works, including working platforms for tracked plant.

The TWC's responsibilities for working platforms include:

**Design brief:** Ensuring the designer has been provided with adequate information about the site conditions, the plant to be used, and any special requirements or constraints.

**Design review:** Reviewing the design calculation and certificate to confirm it is appropriate for the specific site conditions and plant loading. This does not mean the TWC must check every calculation step — that is the role of the independent checker — but the TWC must satisfy themselves that the design is reasonable and complete.

**Design check:** Confirming that the design has been independently checked by a competent checker, and that the check certificate is included with the design.

**Approval and permit:** Issuing a temporary works permit to allow construction of the platform, and subsequently a permit to load to allow the plant to operate on the completed platform.

**Monitoring:** Ensuring the platform is inspected during use and maintained in accordance with the design requirements.`
      },
      {
        heading: "What to Check in a BRE470 Design Certificate",
        content: `When reviewing a BRE470 design certificate, the TWC should verify the following:

**Input parameters match site conditions:** The subgrade type and strength parameters used in the design must be consistent with the ground investigation data for the specific location where the platform will be constructed. If the GI data shows cu = 30 kPa but the design assumes cu = 60 kPa, the design is unconservative and must be revised.

**Correct rig and loading:** The plant loading must correspond to the actual rig that will operate on the platform. Check the rig model, track dimensions, and track pressures against the manufacturer's data or EN 996 specifications.

**Appropriate partial factors:** BRE470 specifies partial factors for loads (γF = 1.26) and materials (γM applied to tan φ'). Verify these have been correctly applied.

**Platform material specification:** The assumed angle of shearing resistance (φ'p) must be achievable with the specified fill material. If the design assumes φ'p = 45° (well-graded crushed rock), the material specification must require this grade of material.

**Adequate thickness:** The calculated thickness should be reasonable for the given parameters. Very thin platforms (less than 300 mm) on soft ground should be questioned. Very thick platforms (over 1000 mm) may indicate that the subgrade is too weak and alternative solutions should be considered.

**Designer and checker credentials:** Confirm that the designer and checker are competent and that the check has been carried out independently.`
      },
      {
        heading: "Common Issues and Red Flags",
        content: `In practice, TWCs frequently encounter the following issues with working platform designs:

**Optimistic subgrade parameters:** Designers sometimes use subgrade strengths that are higher than the ground investigation data supports. This leads to thinner platforms that may be inadequate. Always cross-reference the design parameters with the GI report.

**Wrong rig:** The design may have been prepared for a different rig than the one actually being used on site. If the rig changes after the design is issued, the design must be re-checked for the new rig's track pressures.

**No ground investigation:** Some designs are based on assumed subgrade parameters without any ground investigation data. While this is sometimes unavoidable at tender stage, the design should be updated when GI data becomes available. Assumed parameters should be clearly stated and conservative.

**Missing check certificate:** A design without an independent check certificate is incomplete and should not be approved. The check is a fundamental requirement of BS 5975.

**Platform not built to design:** Even a perfect design is worthless if the platform is not constructed in accordance with it. The TWC should verify that the correct material has been used, the correct thickness has been achieved, and the platform has been properly compacted.`
      },
      {
        heading: "How Our Certificates Support the TWC",
        content: `Our BRE470 design certificates are specifically designed to make the TWC's review process as straightforward as possible:

**Clear parameter tabulation:** All input parameters are presented in a clear table format, making it easy to cross-reference with ground investigation data and rig specifications.

**Full calculation audit trail:** Every step of the BRE470 Appendix A calculation is shown, so the TWC can follow the design logic without needing to reproduce the calculation.

**Cross-section diagram:** A scaled diagram showing the platform layers, dimensions, and subgrade helps visualise the design intent.

**Professional certification:** Each certificate includes a unique reference number and is signed by David Miller, Temporary Works Designer. The design has been prepared and checked in accordance with BS 5975 requirements.

**Consistent format:** Every certificate follows the same format, so TWCs who review multiple designs from our tool can quickly find the information they need.

For just £299.99 per design, our tool provides everything the TWC needs to review and approve the working platform design efficiently and confidently.`
      }
    ]
  },
  {
    slug: "piling-rig-track-pressures",
    title: "Choosing the Right Piling Rig: Track Pressures and Platform Design",
    metaTitle: "Piling Rig Track Pressures Explained | EN 996 Data | Liebherr, Bauer, Soilmec",
    metaDescription: "Comprehensive guide to piling rig track pressures and their impact on working platform design. EN 996 data for Liebherr, Bauer, and Soilmec rigs. How to select the right rig for your ground conditions.",
    excerpt: "The piling rig you choose directly affects the required working platform thickness. Understanding track pressures and EN 996 data is essential for efficient platform design and cost control.",
    author: "David Miller",
    date: "2026-04-06",
    readTime: "9 min read",
    tags: ["Piling Rigs", "Track Pressures", "EN 996", "Liebherr", "Bauer", "Soilmec"],
    heroImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663349554749/hMJrHrZWZ2XC9JAvjXeKjs/hero-construction-7yCmYE7gTL3hM6e2YBcmpd.webp",
    sections: [
      {
        heading: "Why Track Pressures Matter",
        content: `The track pressure of a piling rig is the single most influential parameter in a BRE470 working platform design. Higher track pressures require thicker platforms, which means more material, more cost, and more time to construct.

Track pressure is expressed in kilopascals (kPa) and represents the ground pressure exerted by the rig's tracks on the working surface. Two values are critical:

**Maximum track pressure (q1k):** This is the highest ground pressure the rig exerts, typically during outrigger operations or when the mast is at maximum reach. This value governs the platform design in most cases.

**Slewing track pressure (q2k):** This is the ground pressure during slewing (rotating) operations. For some rig configurations, particularly those with short loaded track lengths, the slewing case can be more onerous than the outrigger case.

The relationship between track pressure and platform thickness is not linear — a 20% increase in track pressure can require a 30-40% increase in platform thickness, depending on the subgrade conditions. This means that selecting a rig with lower track pressures can significantly reduce platform costs.`
      },
      {
        heading: "EN 996 and Standardised Track Data",
        content: `EN 996 is the European standard that specifies safety requirements for piling equipment. It includes standardised track pressure data for common piling rigs, which is used as the basis for BRE470 platform design.

The key parameters from EN 996 for each rig are:

**Track width (W):** The width of one track shoe, typically 0.6-1.0 m. Wider tracks spread the load over a larger area, reducing ground pressure.

**Overall track length (L1):** The full length of the track in contact with the ground. Longer tracks spread the load longitudinally.

**Loaded track length (L2):** The effective loaded length under slewing conditions. This is typically shorter than L1 as the load concentrates under the mast.

**Maximum track pressure (q1k):** The peak ground pressure under the most onerous operating condition.

**Slewing track pressure (q2k):** The ground pressure during slewing operations.

Our design tool includes EN 996 data for 23 piling rigs from three major manufacturers, so you don't need to look up these values manually.`
      },
      {
        heading: "Liebherr Piling Rigs",
        content: `Liebherr is one of the world's leading manufacturers of piling equipment. Their LB series of rotary drilling rigs is widely used in the UK and internationally.

The LB range spans from the compact LB 16 (suitable for restricted access sites) to the large LB 44 (for deep, large-diameter piles). Key characteristics:

**LB 16:** The smallest in the range, with track pressures around 90-120 kPa. Ideal for restricted access sites and lighter piling works. Requires relatively thin working platforms.

**LB 28:** A mid-range rig commonly used for CFA and rotary bored piling. Track pressures typically 140-190 kPa. This is one of the most popular rigs in the UK market.

**LB 36 and LB 44:** Larger rigs for deep foundations and heavy-duty piling. Track pressures can exceed 200 kPa, requiring substantial working platforms on weak ground.

**LRB 155 and LRB 255:** Liebherr's leader rig range for driven piling and sheet piling. These have different track configurations and pressure distributions compared to the LB rotary rigs.

Our tool includes all major Liebherr models with EN 996 data pre-loaded, making it easy to generate a platform design for any Liebherr rig in the fleet.`
      },
      {
        heading: "Bauer and Soilmec Rigs",
        content: `**Bauer BG Series:** Bauer's BG range is another mainstay of the UK piling market. The range spans from the BG 15 H to the BG 46, covering the full spectrum of rotary drilling applications.

The BG 15 H and BG 20 H are compact rigs suitable for restricted sites, with moderate track pressures. The BG 28 H and BG 30 are popular mid-range rigs, while the BG 39 and BG 46 are heavy-duty machines for large-diameter, deep piles.

Bauer rigs generally have similar track pressure characteristics to equivalent Liebherr models, though the specific values vary by model and configuration.

**Soilmec SR Series:** Soilmec's SR range includes the SR-30, SR-40, SR-50, SR-65, SR-75, SR-80, and SR-100. These Italian-manufactured rigs are widely used in the UK, particularly for CFA piling.

The SR-30 and SR-40 are compact rigs with relatively low track pressures, making them suitable for sites with weak ground conditions. The SR-75 and SR-100 are large rigs with higher track pressures that require more substantial platforms.

All 23 rigs across these three manufacturers are pre-loaded in our design tool, with EN 996 track dimensions and pressures auto-filled when you select a rig model.`
      },
      {
        heading: "Optimising Platform Design Through Rig Selection",
        content: `Understanding the relationship between rig selection and platform requirements can lead to significant cost savings:

**Consider the platform cost in rig selection:** When choosing a rig for a project, the platform cost should be factored into the overall cost comparison. A larger rig with higher track pressures may be faster at installing piles, but if it requires a 900 mm platform instead of a 500 mm platform, the additional material and construction cost may outweigh the production benefit.

**Run multiple scenarios:** Our design tool makes it economical to run platform designs for different rigs and compare the results. At £299.99 per design, running 2-3 scenarios to optimise the rig/platform combination is a worthwhile investment.

**Consider ground improvement:** On sites with very weak subgrade, it may be more economical to improve the ground (e.g., with lime stabilisation or preloading) rather than constructing an excessively thick platform. Our tool helps quantify the platform requirement so you can make an informed comparison.

**Use geosynthetic reinforcement:** Including a geogrid at the base of the platform can reduce the required thickness by 20-30%, depending on the subgrade conditions. Our tool includes the option to design with geosynthetic reinforcement.

The key message is that platform design should not be an afterthought — it should be considered alongside rig selection and ground conditions as part of the overall project planning process.`
      }
    ]
  }
,
  {
    slug: "digitising-bre470-platform-design",
    title: "Working Platform Design in the Digital Age: How BRE470 Compliance is Being Transformed",
    metaTitle: "Digitising BRE470 Working Platform Design for the UK Piling Industry | BRE470 Piling Mat Designer",
    metaDescription: "How digital tools are transforming BRE470 working platform design — from weeks of consultancy to instant, signed design certificates for UK piling contractors.",
    excerpt: "Every piling contractor knows the scenario: the rig is booked, the programme is tight, and the platform design is still in someone's inbox. This article examines how digital tools are closing that gap.",
    author: "David Miller",
    date: "2026-04-20",
    readTime: "12 min read",
    tags: ["BRE470", "Digital Design", "Industry", "CDM 2015", "BS 5975"],
    heroImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663349554749/hMJrHrZWZ2XC9JAvjXeKjs/hero-construction-7yCmYE7gTL3hM6e2YBcmpd.webp",
    sections: [
      {
        heading: "The Problem We All Know",
        content: `Every piling contractor in the UK has experienced it. A project is mobilising, the rig is booked, the programme is tight — and the working platform design is still sitting in someone's inbox. The traditional route is well-worn: commission a geotechnical consultant, wait for a ground investigation report, brief a temporary works designer, wait for calculations, get them checked to Category 2 or 3, issue the design brief, and then — finally — build the platform. That process routinely takes three to six weeks. On a fast-track project, it can hold up the entire piling programme.

The consequences are predictable. Platforms get built without formal design. Site teams rely on experience and \"what we did last time.\" A 600mm layer of Type 1 gets placed because it has always been 600mm, regardless of whether the rig weighs 40 tonnes or 120 tonnes, and regardless of whether the subgrade is stiff London Clay or soft alluvial silt. The result is either an over-engineered platform that wastes material and programme, or — far worse — an under-designed platform that fails under load.

Platform failure is not a theoretical risk. The Federation of Piling Specialists (FPS) and the Temporary Works Forum (TWf) have documented numerous incidents where tracked plant has become bogged, tilted, or overturned due to inadequate working platforms. These incidents cause programme delays measured in weeks, plant damage measured in tens of thousands of pounds, and — in the worst cases — serious injury or death.`
      },
      {
        heading: "What BRE470 Actually Requires",
        content: `BRE470 (Working Platforms for Tracked Plant: Good Practice Guide to the Design, Installation, Maintenance and Repair of Ground-Supported Working Platforms) was published by the Building Research Establishment to provide a rational, engineering-based methodology for platform design. Its Appendix A sets out the calculation procedure that has become the industry standard.

The methodology is straightforward in principle. For **cohesive subgrades**, the required platform thickness is determined by comparing the applied bearing pressure from the plant's tracks against the undrained shear strength of the subgrade, using Meyerhof's bearing capacity equations with appropriate partial factors. For **granular subgrades**, the approach uses the load spread method through the platform fill, checking that the applied pressure at the base of the platform does not exceed the allowable bearing capacity of the underlying soil.

The key inputs are: plant gross weight and track dimensions (from manufacturer's data or EN 996), subgrade undrained shear strength (cu) or bearing capacity (from ground investigation or conservative assumption), platform fill properties (material specification, typically CBR > 10%), load spread angle (BRE470 Table A.1, typically 53° for granular fill), and partial factors (BRE470 Table A.2, 1.5 on bearing capacity, 1.0 on loads).

The calculation itself is not complex — a competent engineer can complete it in 30 minutes. The delay is not in the engineering; it is in the procurement chain, the communication loop, and the checking process.`
      },
      {
        heading: "The Digital Solution",
        content: `Temporary Works Consulting Ltd has developed the **BRE470 Piling Mat Designer** — a web-based tool that allows piling contractors, temporary works coordinators, and site engineers to obtain a fully compliant BRE470 working platform design in minutes rather than weeks.

The tool implements the full Appendix A calculation methodology for both cohesive and granular subgrades, with optional geosynthetic reinforcement. It includes a database of 23 piling rigs from Liebherr, Bauer, and Soilmec, with EN 996 track dimensions and loading values pre-loaded. Users input their site-specific soil parameters, select their rig, and the tool produces:

**Full interpretive design calculations** — step-by-step, auditable, showing every input, assumption, partial factor, and intermediate result.

**A professional design certificate** — a five-section document including project details, design parameters, calculation summary, recommendations, and a signed check certificate by a named Temporary Works Designer.

**A cross-section diagram** — showing the platform layers, fill thickness, and subgrade interface.

Each design is priced at **£299.99** — a fraction of the cost of a traditional consultancy commission, and delivered instantly rather than in weeks.`
      },
      {
        heading: "Compliance Under CDM 2015 and BS 5975:2024",
        content: `The Construction (Design and Management) Regulations 2015 place clear duties on all parties. The Principal Contractor must ensure that working platforms are designed, installed, and maintained to support the plant that will operate on them. The Temporary Works Coordinator (TWC) must ensure that a design brief is issued, a design is produced, and the design is checked before the platform is built.

BS 5975:2024 (Code of Practice for Temporary Works Procedures and the Permissible Stress Design of Falsework) reinforces this framework. It requires that temporary works — including working platforms — follow a structured process: design brief, design, design check (Category 2 or 3 depending on risk), permit to load, and inspection regime.

The BRE470 Piling Mat Designer fits directly into this framework. The output is a formal design document that can be issued as the temporary works design. The TWC can review the design certificate, confirm that the inputs match the site conditions, and issue the permit to load. The design is transparent, auditable, and traceable — exactly what a CDM-compliant process requires.

Importantly, the tool does not replace engineering judgement. It requires the user to input site-specific soil parameters, which must come from a ground investigation or a conservative assumption agreed with the project team. The tool performs the calculation; the engineer owns the inputs and the decision to proceed.`
      },
      {
        heading: "The Commercial Case",
        content: `The commercial argument is compelling. A traditional working platform design commission typically costs between £800 and £2,500, depending on the consultant, the complexity, and the checking category. Turnaround is typically two to four weeks, sometimes longer during busy periods.

The BRE470 Piling Mat Designer offers the same professional output at £299.99 per design, delivered instantly, available 24/7 from any device. The output is a standardised 5-section certificate with full step-by-step calculations and a database of 23 rigs pre-loaded with EN 996 data.

For a piling contractor running multiple rigs across multiple sites, the savings are substantial — not just in design fees, but in programme time. A platform design that arrives three weeks faster means the rig mobilises three weeks earlier. On a project where the piling programme is on the critical path, that can be worth tens of thousands of pounds in prelims alone.`
      },
      {
        heading: "Quality and Accountability",
        content: `Every design certificate is signed by David Miller, a Senior Chartered Temporary Works Design Engineer with over 25 years of experience in UK and international projects. The certificate includes a formal check certificate section, confirming that the design has been reviewed against the BRE470 methodology and the stated input parameters.

The tool is not a \"black box.\" Every calculation step is shown, every partial factor is identified, and every assumption is stated. A Category 2 design checker can review the output and verify the engineering logic without needing to repeat the calculation from scratch.`
      },
      {
        heading: "Who Should Use It",
        content: `The BRE470 Piling Mat Designer is designed for:

**Piling contractors** who need compliant platform designs quickly and cost-effectively.

**Temporary Works Coordinators** who need a formal design document to satisfy BS 5975 and CDM 2015 requirements.

**Principal Contractors** who need to demonstrate that working platforms have been properly designed before piling operations commence.

**Site Agents and Project Managers** who need to keep the programme moving without compromising safety.

Working platform design should not be a bottleneck. The engineering is well-established, the methodology is codified in BRE470, and the regulatory framework under CDM 2015 and BS 5975:2024 is clear. What has been missing is a fast, affordable, and transparent way to get from soil parameters to signed certificate. The BRE470 Piling Mat Designer closes that gap.

The tool is live now at www.bre470pilingmatdesign.com. A free CPD presentation — \"BRE470 Compliance Made Simple\" — is also available for teams at www.bre470pilingmatdesign.com/cpd.`
      }
    ]
  }
];

export function getArticleBySlug(slug: string): BlogArticle | undefined {
  return BLOG_ARTICLES.find(a => a.slug === slug);
}
