/**
 * Project showcase data.
 *
 * The Projects section renders straight from this array. While it is empty the
 * section shows a prepared empty state. Add one object per project and the
 * section switches to a card grid automatically, no other changes needed.
 *
 * Project shape:
 *
 *   {
 *     name:        "Project name",                    // required
 *     category:    "Residential",                     // Residential | Commercial | Industrial | Development
 *     location:    "City, State",                     // optional
 *     year:        "2025",                            // optional
 *     description: "One or two sentences.",           // optional
 *     services:    ["Structural Design", "Drawings"], // optional
 *     image: {
 *       src:    "assets/img/projects/example.jpg",    // required if an image is used
 *       webp:   "assets/img/projects/example.webp",   // optional
 *       alt:    "Describe what is shown",             // required if an image is used
 *       width:  1400,
 *       height: 1050
 *     }
 *   }
 *
 * Only add projects that have actually been completed or are genuinely in
 * progress, with details confirmed by the company.
 */

export const projects = [];
