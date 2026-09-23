---
layout: default
title: Assembly
parent: Universal Flight Computer
grand_parent: Projects
nav_order: 4
permalink: /docs/projects/ufc/assembly/
---

# Assembly
{: .no_toc }

The tools, fasteners, and parts that go into the UFC structure, and photos of it being put together.
{: .fs-5 .fw-300 }

{: .check }
> The old wiki's assembly guide is **photos only**, with no written steps. The photos are dated 22 May 2025,
> so they show the **2025 structure**. The 2026 (UFC 3.5) structure is shorter and has the BMS inside a smaller
> battery holder ([Structure]({{ '/docs/projects/ufc/architecture/' | relative_url }}#structure)), so some of the
> parts below will be different.
>
> If you're assembling a UFC, please write down the steps as you go and add them here.

<details markdown="block">
  <summary>Contents</summary>
  {: .text-delta }
- TOC
{:toc}
</details>

## Tools

- 1/16 in hex (Allen) key
- 1/8 in hex key
- Small flathead screwdriver, for the terminal block
- Large Phillips screwdriver, for the screw switch

{% include photo-links.html label="Photo" urls="https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/851075a4-9de3-4ba8-9260-9769504ea20a" %}

## Fasteners

| Qty | Fastener | Tool | Joins |
|--:|:--|:--|:--|
| 4 | 12-24 × 3/8 in countersunk screw | 1/8 in hex | Top bulkhead to brackets |
| 3 | 12-24 × 1 in screw | 1/8 in hex | UFC battery brace to top bulkhead |
| 1 | 12-24 × 3/4 in screw | 1/8 in hex | The one special top bulkhead screw |
| 4 | 12-24 nylon-insert lock nut | — | Under the top bulkhead |
| 4 | 12-24 washer | — | Between the nuts and the top bulkhead |
| 8 | 12-24 × 3/8 in screw | 1/8 in hex | Brackets to UFC plates |
| 4 | 12-24 × 1/2 in screw | 1/8 in hex | Bottom bulkhead to brackets |
| 8 | 4-40 × 1/2 in screw | 1/16 in hex | UFC plates to backplane |
| 1 | 6-32 × 1/8 in Phillips screw | Phillips | Screw switch |

{% include photo-links.html label="Photo" urls="https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/563d1b0a-5682-441d-bf3c-2e4ff43c8d56" %}

## Parts

| Qty | Part | Design file |
|--:|:--|:--|
| 1 | UFC 3S3P battery | |
| 1 | UFC plastic battery cable holder | |
| 1 | UFC battery brace | |
| 1 | Screw switch (with its 6-32 × 1/8 in Phillips screw) | |
| 1 | Bottom bulkhead | [`Bottom_Recovery_Bulkhead.SLDPRT`](https://github.umn.edu/Rocket-Team/UFC-2024/blob/main/CAD/Bottom_Recovery_Bulkhead.SLDPRT) |
| 1 | Top bulkhead | [`Top_Recovery_Bulkhead.SLDPRT`](https://github.umn.edu/Rocket-Team/UFC-2024/blob/main/CAD/Top_Recovery_Bulkhead.SLDPRT) |
| 1 | Right plate, with the backplane standoff | [`Rail_Front.SLDPRT`](https://github.umn.edu/Rocket-Team/UFC-2024/blob/main/CAD/Rail_Front.SLDPRT), [`Backplane_standoff.SLDPRT`](https://github.umn.edu/Rocket-Team/UFC-2024/blob/main/CAD/Backplane_standoff.SLDPRT) |
| 1 | Left plate | [`Rail_Back.SLDPRT`](https://github.umn.edu/Rocket-Team/UFC-2024/blob/main/CAD/Rail_Back.SLDPRT) |
| 2 | Middle standoff | [`Middle_Standoff.SLDPRT`](https://github.umn.edu/Rocket-Team/UFC-2024/blob/main/CAD/Middle_Standoff.SLDPRT) |
| 4 | Bracket | [`Top_Plate_Bracket.SLDPRT`](https://github.umn.edu/Rocket-Team/UFC-2024/blob/main/CAD/Top_Plate_Bracket.SLDPRT) |
| 1 | Backplane | [Altium 365](https://rocket-team.365.altium.com/designs/53DDD4B2-7DCF-4AE1-BEEF-ACE332D8193F) |

{% include photo-links.html label="Photo" urls="https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/19392cb6-803a-4c97-8245-77765f8268bb" %}

## Assembly photos

In the order the old wiki had them. Each link opens one photo.

### Top bulkhead

{% include photo-links.html label="Photos" urls="https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/08102c1d-baf1-4bc8-a082-132723a2c621, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/1be5e950-c06d-45f0-8b8c-1518c55ea1ff, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/16cdadd7-a4b8-4914-b7eb-12d6fabd9969, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/e741bbe5-5fc1-4573-8180-55dfff8cd689, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/faf141e1-63c2-48fa-ac14-dbd5a87a8067, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/175888f1-d28e-4e59-b1ce-dbd7afad830f, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/5c70d7f6-47e4-4f2a-ba07-b672fb7f786e, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/833ae330-26fc-44f1-be2d-0f5e7e1413c4, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/f82065d4-5bf9-4db7-b69e-66f567778bd9, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/cd9ff0c0-5d73-4c37-b0fe-61250564d67c, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/aedb92e7-ad14-4ce0-978a-21555a2a2cdb, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/d89d214d-1c13-4870-b844-664c20b893c9, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/738b7b0c-e649-4b59-a168-f9b08ad34052, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/396e10d1-8cd8-4977-b96b-972b14c995f5" %}

### Bottom bulkhead

{% include photo-links.html label="Photos" urls="https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/94978a1c-b98f-4250-a609-6fb7149be0cd, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/bdee855f-7730-4edb-ba6e-fc3598ca84b4, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/bbee4245-14e4-4a07-98d6-174f274643ea, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/96ed50c0-e77a-44f1-815a-8df49b6544aa, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/cfffa41d-5df7-4fdd-a097-803e5fdbfd69, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/cad402a1-3fe2-46b7-9f18-06c16cf516f2" %}

### Right plate

{% include photo-links.html label="Photos" urls="https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/f980e8f2-c482-41c0-8edd-7e0ecd6d3b9b, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/47742b8d-265a-47cb-b5f4-d034181c461e, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/9159dcec-84ed-4226-b0ff-481ef9fe04fc, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/d946679e-c134-48a3-af3f-566118da994c, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/7dc27683-3bfa-454a-b804-277571ec8d40, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/26e1e62c-ecc1-4514-a23b-9d795e144135, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/75904412-3439-4c97-b3cf-ee2a8f2f247e, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/f835c0e0-466a-4f14-b92d-cd38d0f1bdee, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/1b5443a0-b7e9-452b-ac41-81d8629026ab" %}

### Finished structure

{% include photo-links.html label="Photos" urls="https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/6942fb17-c379-40bf-b5e4-ba1087023dd9, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/61bff9f8-7c6c-4c1c-a96b-a6af58d813eb, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/56ccf38c-2118-4a4f-9b16-83f31bee2956, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/1a72c8dd-0663-452e-8084-010384450f05, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/c9d3a0d5-feed-4fc6-a345-3970e30cb13e, https://github.umn.edu/Rocket-Team/UFC-2024/assets/26095/5a9f183c-522a-4042-8a3c-c8be7f76ecc7" %}
