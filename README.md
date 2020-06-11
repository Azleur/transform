# Axis-aligned transforms

This TypeScript module offers a common representation for 2D coordinate transformations where the old `x` and `y` axes are kept parallel to the new ones. It also offers tools for calculating transforms and applying them to 2D vectors.

## How it works

* `AffineTransform` represents an axis-aligned coordinate transformation (map `(x0,y0)` in some coordinate system to `(x1, y1)` in a different coordinate system, keeping old and new (X, Y) axes parallel).
* You can apply a transform to a point using `TransformPoint()`, and recover the original point using `InverseTransformPoint()`.
* Same for rects, using `TransformRect()` and `InverseTransformRect()`.
* You can stretch coordinates from one rectangle to another by using `ScaleStretch()`.
* You can fit coordinates from one rectangle into another (without stretching) by using `ScaleFit()`.

## Example

```typescript
const bounds1 = new Rect(0, 0, 2, 3); // w: 2, h: 3, center: { x: 1, y: 1.5 }.
const bounds2 = new Rect(1, 1, 5, 10); // w: 4, h: 9, center: { x: 3, y: 5.5 }.

const rect0 = new Rect(1, 1, 2, 2); // w: 1, h: 1, center: {x: 1.5, y: 1.5}.
const v0 = new Vec2(1, 1); // {x: 1, y: 1}.

// --------

// Same relative position within rect:
const stretch = ScaleStretch(bounds1, bounds2); // Scale x by 2 and y by 3, send corners to corners and center to center.
const v1 = TransformPoint(v0, stretch); // v1 == { x: 3, y: 4 }.
const v2 = InverseTransformPoint(v1, stretch); // v2 == v0.
const rect1 = TransformRect(r0, stretch); // rect1 == { min: { x: 3, y: 4 }, max: { x: 5, y: 7 } }.
const rect2 = InverseTransformRect(r0, stretch); // rect2 == { min: { x: 0, y: 0 }, max: { x: 0.5, y: 0.333 } }.

// --------

// Don't stretch vectors (zoom equally on all directions):
const fit = ScaleFit(bounds1, bounds2); // Scale x and y by 2, send center to center.
const v3 = TransformPoint(v0, fit); // v3 == { x: 3, y: 4.5 }.
const v4 = InverseTransformPoint(v3, fit); // v4 == v0.
// etc.
```
