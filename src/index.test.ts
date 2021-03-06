import { Vec2 } from '@azleur/vec2';
import { Rect } from '@azleur/rect';

import {
    AffineTransform, ScaleFit, ScaleStretch,
    TransformPoint, InverseTransformPoint,
    TransformRect, InverseTransformRect,
    TransformVec, InverseTransformVec, 
    TransformArea, InverseTransformArea
} from '.';

test("ScaleStretch(inner, outer, options?) returns an AffineTransform object representing how to map coordinates within inner to coordinates within outer", () => {
    const rect1 = new Rect(0, 0, 1, 1); // w: 1, h: 1.
    const rect2 = new Rect(1, 2, 3, 5); // w: 2, h: 3.
    const rect3 = new Rect(1, 2, 5, 8); // w: 4, h: 6.

    // Transform keeps axes aligned, but stretches if needed.
    const out1: AffineTransform = ScaleStretch(rect1, rect2);
    expect(out1).toEqual({ offset: new Vec2(1, 2), scale: new Vec2(2, 3) });

    // Scale affects offset.
    const out2: AffineTransform = ScaleStretch(rect2, rect3);
    expect(out2).toEqual({ offset: new Vec2(-1, -2), scale: new Vec2(2, 2) });

    // Zoom affects offset (keeps center in place).
    const out3: AffineTransform = ScaleStretch(rect2, rect3, { zoom: 2 });
    expect(out3).toEqual({ offset: new Vec2(-5, -9), scale: new Vec2(4, 4) });
});

test("TransformPoint(input, transform) applies transform to input", () => {
    const rect1 = new Rect(0, 0, 1, 1); // w: 1, h: 1.
    const rect2 = new Rect(1, 2, 3, 5); // w: 2, h: 3.

    const vec1 = new Vec2(1 / 2, 2 / 3);

    const transform1: AffineTransform = ScaleStretch(rect1, rect2);
    const out1: Vec2 = TransformPoint(vec1, transform1);
    expect(out1).toEqual(new Vec2(2, 4));

    // TODO: More cases.
});

test("InverseTransformPoint(input, transform) applies inverse transform to input", () => {
    const rect1 = new Rect(0, 0, 1, 1); // w: 1, h: 1.
    const rect2 = new Rect(1, 2, 3, 5); // w: 2, h: 3.

    const vec1 = new Vec2(2, 4);

    const transform1: AffineTransform = ScaleStretch(rect1, rect2);
    const out1: Vec2 = InverseTransformPoint(vec1, transform1);
    expect(out1).toEqual(new Vec2(1 / 2, 2 / 3));

    // TODO: More cases.
});

test("ScaleFit(inner, outer, options?) returns a UniformTransform object representing how to uniformly scale inner so it fits inside outer while centered", () => {
    const rect1 = new Rect(0, 0, 1, 1); // w: 1, h: 1.
    const rect2 = new Rect(1, 2, 3, 5); // w: 2, h: 3.
    const rect3 = new Rect(1, 2, 5, 8); // w: 4, h: 6.

    // Uniform scaling with inner completely contained in outer.
    const out1: AffineTransform = ScaleFit(rect1, rect2);
    expect(out1).toEqual({ offset: new Vec2(1, 2.5), scale: new Vec2(2, 2) });

    // Scale affects offset.
    const out2: AffineTransform = ScaleFit(rect2, rect3);
    expect(out2).toEqual({ offset: new Vec2(-1, -2), scale: new Vec2(2, 2) });

    // Zoom affects offset.
    const out3: AffineTransform = ScaleFit(rect2, rect3, { zoom: 2 });
    expect(out3).toEqual({ offset: new Vec2(-5, -9), scale: new Vec2(4, 4) });

    // invertY changes sign of scale.y and affects offset.
    const out4: AffineTransform = ScaleFit(rect1, rect2, { invertY: true });
    expect(out4).toEqual({ offset: new Vec2(1, 4.5), scale: new Vec2(2, -2) });
});

test("TransformRect() applies the forward transform to a whole rect, respecting min and max", () => {
    const unit     = new Rect(0, 0, 1, 1);
    const double   = new Rect(0, 0, 2, 2);
    const plusOne  = new Rect(1, 1, 2, 2);
    const combined = new Rect(1, 2, 3, 5);

    const unitMiddle     = new Rect(0.25, 0.25, 0.75, 0.75);
    const doubleMiddle   = new Rect(0.5 , 0.5 , 1.5 , 1.5 );
    const plusOneMiddle  = new Rect(1.25, 1.25, 1.75, 1.75);
    const combinedMiddle = new Rect(1.5 , 2.75, 2.5 , 4.25);

    const unitToDouble   = ScaleStretch(unit, double  );
    const unitToPlusOne  = ScaleStretch(unit, plusOne );
    const unitToCombined = ScaleStretch(unit, combined);

    expect(TransformRect(unitMiddle, unitToDouble  )).toEqual(doubleMiddle  );
    expect(TransformRect(unitMiddle, unitToPlusOne )).toEqual(plusOneMiddle );
    expect(TransformRect(unitMiddle, unitToCombined)).toEqual(combinedMiddle);
});

test("InverseTransformRect() applies the inverse transform to a whole rect, respecting min and max", () => {
    const unit     = new Rect(0, 0, 1, 1);
    const double   = new Rect(0, 0, 2, 2);
    const plusOne  = new Rect(1, 1, 2, 2);
    const combined = new Rect(1, 2, 3, 5);

    const unitMiddle     = new Rect(0.25, 0.25, 0.75, 0.75);
    const doubleMiddle   = new Rect(0.5 , 0.5 , 1.5 , 1.5 );
    const plusOneMiddle  = new Rect(1.25, 1.25, 1.75, 1.75);
    const combinedMiddle = new Rect(1.5 , 2.75, 2.5 , 4.25);

    const unitToDouble   = ScaleStretch(unit, double  );
    const unitToPlusOne  = ScaleStretch(unit, plusOne );
    const unitToCombined = ScaleStretch(unit, combined);

    expect(InverseTransformRect(doubleMiddle  , unitToDouble  )).toEqual(unitMiddle);
    expect(InverseTransformRect(plusOneMiddle , unitToPlusOne )).toEqual(unitMiddle);
    expect(InverseTransformRect(combinedMiddle, unitToCombined)).toEqual(unitMiddle);
});

test("TransformVec(input, transform) applies transform to input", () => {
    const rect1 = new Rect(0, 0, 1, 1); // w: 1, h: 1.
    const rect2 = new Rect(1, 2, 3, 5); // w: 2, h: 3.

    const vec1 = new Vec2(1 / 2, 2 / 3);

    const transform1: AffineTransform = ScaleStretch(rect1, rect2);
    const out1: Vec2 = TransformVec(vec1, transform1);
    // Only linear part matters.
    expect(out1).toEqual(new Vec2(1, 2));

    // TODO: More cases.
});

test("InverseTransformVec(input, transform) applies inverse transform to input", () => {
    const rect1 = new Rect(0, 0, 1, 1); // w: 1, h: 1.
    const rect2 = new Rect(1, 2, 3, 5); // w: 2, h: 3.

    const vec1 = new Vec2(1, 2);

    const transform1: AffineTransform = ScaleStretch(rect1, rect2);
    const out1: Vec2 = InverseTransformVec(vec1, transform1);
    // Only linear part matters.
    expect(out1).toEqual(new Vec2(1 / 2, 2 / 3));

    // TODO: More cases.
});

test("TransformArea(input, transform) applies the forward linear part to a Rect", () => {
    const unit     = new Rect(0, 0, 1, 1);
    const double   = new Rect(0, 0, 2, 2);
    const plusOne  = new Rect(1, 1, 2, 2);
    const combined = new Rect(1, 2, 3, 5);

    const unitMiddle     = new Rect(0.25, 0.25, 0.75, 0.75);
    const doubleMapped   = new Rect(0.5 , 0.5 , 1.5 , 1.5 );
    const combinedMapped = new Rect(0.5 , 0.75, 1.5 , 2.25);

    const unitToDouble   = ScaleStretch(unit, double  );
    const unitToPlusOne  = ScaleStretch(unit, plusOne );
    const unitToCombined = ScaleStretch(unit, combined);

    expect(TransformArea(unitMiddle, unitToDouble  )).toEqual(doubleMapped  );
    expect(TransformArea(unitMiddle, unitToPlusOne )).toEqual(unitMiddle    );
    expect(TransformArea(unitMiddle, unitToCombined)).toEqual(combinedMapped);
});

test("InverseTransformArea(input, transform) applies the inverse linear part to a Rect", () => {
    const unit     = new Rect(0, 0, 1, 1);
    const double   = new Rect(0, 0, 2, 2);
    const plusOne  = new Rect(1, 1, 2, 2);
    const combined = new Rect(1, 2, 3, 5);

    const unitMiddle     = new Rect(0.25, 0.25, 0.75, 0.75);
    const doubleMapped   = new Rect(0.5 , 0.5 , 1.5 , 1.5 );
    const combinedMapped = new Rect(0.5 , 0.75, 1.5 , 2.25);

    const unitToDouble   = ScaleStretch(unit, double  );
    const unitToPlusOne  = ScaleStretch(unit, plusOne );
    const unitToCombined = ScaleStretch(unit, combined);

    expect(InverseTransformArea(doubleMapped  , unitToDouble  )).toEqual(unitMiddle);
    expect(InverseTransformArea(unitMiddle    , unitToPlusOne )).toEqual(unitMiddle);
    expect(InverseTransformArea(combinedMapped, unitToCombined)).toEqual(unitMiddle);
});