# Transform

This repo contains a representation for (x,y)-axis preserving affine transforms, and functions to obtain both:

1) Stretch transform: Remap all points from one rect to all points from another, stretching if necessary.
2) Fit transform: Scale first rect to fit tightly inside second, move to share center. Keeps uniform scaling (no stretching).
