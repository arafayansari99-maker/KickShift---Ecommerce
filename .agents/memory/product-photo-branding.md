---
name: Shoe photo branding
description: The approved Kickshift shoe-side mark and product-image treatment.
---

Use the circular KS app mark as a small, monochrome engraved detail on the lateral side of every shoe. Do not put the KICKSHIFT wordmark on the shoe or add separate brand text badges to shoe-image layouts. The full wordmark may remain in the site header.

**Why:** The user wants the circle logo itself to showcase the brand on each shoe, without the previous shoe branding.

**How to apply:** Position the mark on the visible shoe panel in every product view, thumbnail, and customizer; keep it visually integrated with the material and remove separate shoe-image brand badges.

## Product gallery backgrounds

Some side-profile PNGs may have a checkerboard pattern flattened into opaque pixels instead of real transparency. Verify the image alpha channel before relying on CSS gallery backgrounds.

**Why:** CSS cannot replace a background baked into the source image, so the checkerboard remains visible over any product-specific backdrop.

**How to apply:** Use images with true alpha for gallery views placed over colorway backgrounds; keep flattened originals separate from transparent derivatives.