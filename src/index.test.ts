import { Vec2 } from '@azleur/vec2';
import { Rect } from '@azleur/rect';

import { ScaleStretch, AffineTransform, ApplyTransform, ScaleFit, InverseTransform } from '.';

test("ScaleStretch(inner, outer, options?) returns an AffineTransform object representing how to map coordinates within inner to coordinates within outer", () => {
    const rect1 = new Rect(0, 0, 1, 1); // w: 1, h: 1.
    const rect2 = new Rect(1, 2, 3, 5); // w: 2, h: 3.
    const rect3 = new Rect(1, 2, 5, 8); // w: 4, h: 6.

    // Transform keeps axes aligned, but stretches if needed.
    const out1: AffineTransform = ScaleStretch(rect1, rect2);
    expect(out1).toEqual({ offset: { x: 1, y: 2 }, scale: { x: 2, y: 3 } });

    // Scale affects offset.
    const out2: AffineTransform = ScaleStretch(rect2, rect3);
    expect(out2).toEqual({ offset: { x: -1, y: -2 }, scale: { x: 2, y: 2 } });

    // Zoom affects offset (keeps center in place).
    const out3: AffineTransform = ScaleStretch(rect2, rect3, { zoom: 2 });
    expect(out3).toEqual({ offset: { x: -5, y: -9 }, scale: { x: 4, y: 4 } });
});

test("ApplyTransform(input, transform) applies transform to input", () => {
    const rect1 = new Rect(0, 0, 1, 1); // w: 1, h: 1.
    const rect2 = new Rect(1, 2, 3, 5); // w: 2, h: 3.

    const vec1 = new Vec2(1 / 2, 2 / 3);

    const transform1: AffineTransform = ScaleStretch(rect1, rect2);
    const out1: Vec2 = ApplyTransform(vec1, transform1);
    expect(out1).toEqual({ x: 2, y: 4 });

    // TODO: More cases.
});

test("InverseTransform(input, transform) applies inverse transform to input", () => {
    const rect1 = new Rect(0, 0, 1, 1); // w: 1, h: 1.
    const rect2 = new Rect(1, 2, 3, 5); // w: 2, h: 3.

    const vec1 = new Vec2(2, 4);

    const transform1: AffineTransform = ScaleStretch(rect1, rect2);
    const out1: Vec2 = InverseTransform(vec1, transform1);
    expect(out1).toEqual({ x: 1 / 2, y: 2 / 3 });

    // TODO: More cases.
});

test("ScaleFit(inner, outer, options?) returns a UniformTransform object representing how to uniformly scale inner so it fits inside outer while centered", () => {
    const rect1 = new Rect(0, 0, 1, 1); // w: 1, h: 1.
    const rect2 = new Rect(1, 2, 3, 5); // w: 2, h: 3.
    const rect3 = new Rect(1, 2, 5, 8); // w: 4, h: 6.

    // Uniform scaling with inner completely contained in outer.
    const out1: AffineTransform = ScaleFit(rect1, rect2);
    expect(out1).toEqual({ offset: { x: 1, y: 2.5 }, scale: { x: 2, y: 2 } });

    // Scale affects offset.
    const out2: AffineTransform = ScaleFit(rect2, rect3);
    expect(out2).toEqual({ offset: { x: -1, y: -2 }, scale: { x: 2, y: 2 } });

    // Zoom affects offset.
    const out3: AffineTransform = ScaleFit(rect2, rect3, { zoom: 2 });
    expect(out3).toEqual({ offset: { x: -5, y: -9 }, scale: { x: 4, y: 4 } });

    // invertY changes sign of scale.y and affects offset.
    const out4: AffineTransform = ScaleFit(rect1, rect2, { invertY: true });
    expect(out4).toEqual({ offset: { x: 1, y: 4.5 }, scale: { x: 2, y: -2 } });
});
