import { Vec2 } from "@azleur/vec2";
import { Rect } from "@azleur/rect";

/**
 * Axis-aligned affine transform parameters (independent scaling).
 *
 * To be applied as output = offset + scale * input.
 */
export type AffineTransform = { offset: Vec2, scale: Vec2 };

/** Apply affine transform to point (output = offset + scale * inner). */
export function ApplyTransform(input: Vec2, transform: AffineTransform): Vec2 {
    return new Vec2(
        transform.offset.x + transform.scale.x * input.x,
        transform.offset.y + transform.scale.y * input.y
    );
}

/** Apply the inverse transform to a vector. */
export function InverseTransform(output: Vec2, transform: AffineTransform): Vec2 {
    return new Vec2(
        (output.x - transform.offset.x) / transform.scale.x,
        (output.y - transform.offset.y) / transform.scale.y
    );
}

/**
 * Additional options for ScaleStretch().
 *
 * zoom: modifier applied to scale after exact fit calculation (2.0 twice as big, 0.5 twice as small).
 */
export type StretchOptions = {
    zoom?: number,
};

/** Calculates AffineTransform parameters (offset, scale) used to map points in inner to points in outer. */
export function ScaleStretch(inner: Rect, outer: Rect, options: StretchOptions = {}): AffineTransform {
    const zoom = (options.zoom === undefined) ? 1.0 : options.zoom;

    const diagIn = inner.Diagonal();
    const diagOut = outer.Diagonal();

    const ci = inner.Center();
    const co = outer.Center();

    const sx = zoom * diagOut.x / diagIn.x;
    const sy = zoom * diagOut.y / diagIn.y;

    const ox = co.x - sx * ci.x;
    const oy = co.y - sy * ci.y;

    return { offset: new Vec2(ox, oy), scale: new Vec2(sx, sy) };
}

/** Uniform scaling transform parameters. */
export type UniformTransform = { offset: Vec2, scale: number, invertY: boolean };

/**
 * Additional options for scaleFit().
 *
 * invertY: if true, flips direction of growth of Y axis.
 * zoom: modifier applied to scale after exact fit calculation.
 */
// TODO: Consider unifying StretchOptions and ScaleOptions into one object and adding inverX for completeness.
export type FitOptions = {
    invertY?: boolean,
    zoom?: number;
};

/** Find the scaling parameters that allow inner to fit inside outer with uniform scaling. */
export function ScaleFit(inner: Rect, outer: Rect, options: FitOptions = {}): AffineTransform {
    const invertY = (options.invertY === undefined) ? false : options.invertY;
    const zoom = (options.zoom === undefined) ? 1.0 : options.zoom;

    const flipY = invertY ? -1 : +1;

    const diagIn = inner.Diagonal();
    const diagOut = outer.Diagonal();

    const ci = inner.Center();
    const co = outer.Center();

    const sx = diagOut.x / diagIn.x;
    const sy = diagOut.y / diagIn.y;
    const s = Math.min(sx, sy) * zoom;

    const ox = co.x - s * ci.x;
    const oy = co.y - flipY * s * ci.y;

    return { offset: new Vec2(ox, oy), scale: new Vec2(s, invertY ? -s : +s) };
}
