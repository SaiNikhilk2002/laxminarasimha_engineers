# Image sources and licensing

Every photograph on this site was downloaded from Pexels, optimised locally and stored in
`assets/img/`. Nothing is hotlinked from a third party, so no image can disappear from the site
later.

## Licence

All photographs below are published under the **Pexels License**:
<https://www.pexels.com/license/>

The Pexels License allows free use for commercial and non commercial purposes, without attribution
and without a fee. Attribution is not required, but the original photographers are credited here as
a matter of record. Identifiable people, brands and trademarks are not depicted in any of the
selected images.

The logo files in `assets/logo/` are the company's own brand assets and are not covered by the
licence above.

## Photographs in use

| File (base name) | Used for | Original photo page | Photographer | Licence |
| --- | --- | --- | --- | --- |
| `hero-development` | Hero background | <https://www.pexels.com/photo/10143241/> | Felix Haumann | Pexels License |
| `rcc-frame` | About section, RCC framed structure | <https://www.pexels.com/photo/7108785/> | Mathias Reding | Pexels License |
| `steel-frame` | Expertise section, steel portal frame | <https://www.pexels.com/photo/31197870/> | Laura Cleffmann | Pexels License |
| `structure-aerial` | Call to action band | <https://www.pexels.com/photo/18261218/> | Arian Fernandez | Pexels License |
| `type-residential` | Project types, Residential | <https://www.pexels.com/photo/27459248/> | Dogan Alpaslan Demir | Pexels License |
| `type-commercial` | Project types, Commercial | <https://www.pexels.com/photo/37320179/> | wal_172619 | Pexels License |
| `type-industrial` | Project types, Industrial | <https://www.pexels.com/photo/36006588/> | Peter Xie | Pexels License |
| `type-layouts` | Project types, Development and Layouts | <https://www.pexels.com/photo/7937283/> | Pavel Danilyuk | Pexels License |
| `engineering-drawings` | Projects section, empty state | <https://www.pexels.com/photo/4134179/> | John Guccione | Pexels License |

`assets/img/og-image.jpg` is the social sharing card. It is composed from the hero photograph
(`hero-development`, credited above) with the company logo and heading placed over it.

## File naming

Each photograph exists as a set:

```
name-<width>.webp   responsive WebP variants, referenced by srcset
name.jpg            single JPEG fallback for browsers without WebP support
```

The widths available per image are visible in `assets/img/` and are wired into the `srcset` and
`sizes` attributes in `index.html`.

## Fonts

| Family | Files | Licence |
| --- | --- | --- |
| Archivo | `assets/fonts/archivo-400-700.woff2` | SIL Open Font License 1.1 |
| Inter | `assets/fonts/inter-400-600.woff2` | SIL Open Font License 1.1 |
| IBM Plex Mono | `assets/fonts/ibm-plex-mono-400.woff2`, `assets/fonts/ibm-plex-mono-500.woff2` | SIL Open Font License 1.1 |

The fonts were taken from Google Fonts, subset to the latin character range and self hosted so the
site makes no third party requests at runtime.

## Adding new images

1. Confirm the licence allows commercial use, and that the image carries no watermark, no other
   company's branding and no identifiable private individuals.
2. Save the optimised file into `assets/img/` following the naming pattern above.
3. Add a row to the table in this file with the source URL, creator and licence.
4. Reference it from `index.html` (or from `js/data/projects.js` for project photographs).
