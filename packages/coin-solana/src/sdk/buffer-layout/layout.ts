/**
 * The following methods are based on `buffer-layout-utils`, thanks for their work
 * https://github.com/solana-labs/buffer-layout/blob/master/src/Layout.ts
 */

/* The MIT License (MIT)
 *
 * Copyright 2015-2018 Peter A. Bigot
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * Support for translating between Uint8Array instances and JavaScript
 * native types.
 *
 * {@link module:Layout~Layout|Layout} is the basis of a class
 * hierarchy that associates property names with sequences of encoded
 * bytes.
 *
 * Layouts are supported for these scalar (numeric) types:
 * * {@link module:Layout~UInt|Unsigned integers in little-endian
 *   format} with {@link module:Layout.u8|8-bit}, {@link
    *   module:Layout.u16|16-bit}, {@link module:Layout.u24|24-bit},
 *   {@link module:Layout.u32|32-bit}, {@link
    *   module:Layout.u40|40-bit}, and {@link module:Layout.u48|48-bit}
 *   representation ranges;
 * * {@link module:Layout~UIntBE|Unsigned integers in big-endian
 *   format} with {@link module:Layout.u16be|16-bit}, {@link
    *   module:Layout.u24be|24-bit}, {@link module:Layout.u32be|32-bit},
 *   {@link module:Layout.u40be|40-bit}, and {@link
    *   module:Layout.u48be|48-bit} representation ranges;
 * * {@link module:Layout~Int|Signed integers in little-endian
 *   format} with {@link module:Layout.s8|8-bit}, {@link
    *   module:Layout.s16|16-bit}, {@link module:Layout.s24|24-bit},
 *   {@link module:Layout.s32|32-bit}, {@link
    *   module:Layout.s40|40-bit}, and {@link module:Layout.s48|48-bit}
 *   representation ranges;
 * * {@link module:Layout~IntBE|Signed integers in big-endian format}
 *   with {@link module:Layout.s16be|16-bit}, {@link
    *   module:Layout.s24be|24-bit}, {@link module:Layout.s32be|32-bit},
 *   {@link module:Layout.s40be|40-bit}, and {@link
    *   module:Layout.s48be|48-bit} representation ranges;
 * * 64-bit integral values that decode to an exact (if magnitude is
 *   less than 2^53) or nearby integral Number in {@link
    *   module:Layout.nu64|unsigned little-endian}, {@link
    *   module:Layout.nu64be|unsigned big-endian}, {@link
    *   module:Layout.ns64|signed little-endian}, and {@link
    *   module:Layout.ns64be|unsigned big-endian} encodings;
 * * 32-bit floating point values with {@link
    *   module:Layout.f32|little-endian} and {@link
    *   module:Layout.f32be|big-endian} representations;
 * * 64-bit floating point values with {@link
    *   module:Layout.f64|little-endian} and {@link
    *   module:Layout.f64be|big-endian} representations;
 * * {@link module:Layout.const|Constants} that take no space in the
 *   encoded expression.
 *
 * and for these aggregate types:
 * * {@link module:Layout.seq|Sequence}s of instances of a {@link
    *   module:Layout~Layout|Layout}, with JavaScript representation as
 *   an Array and constant or data-dependent {@link
    *   module:Layout~Sequence#count|length};
 * * {@link module:Layout.struct|Structure}s that aggregate a
 *   heterogeneous sequence of {@link module:Layout~Layout|Layout}
 *   instances, with JavaScript representation as an Object;
 * * {@link module:Layout.union|Union}s that support multiple {@link
    *   module:Layout~VariantLayout|variant layouts} over a fixed
 *   (padded) or variable (not padded) span of bytes, using an
 *   unsigned integer at the start of the data or a separate {@link
    *   module:Layout.unionLayoutDiscriminator|layout element} to
 *   determine which layout to use when interpreting the buffer
 *   contents;
 * * {@link module:Layout.bits|BitStructure}s that contain a sequence
 *   of individual {@link
    *   module:Layout~BitStructure#addField|BitField}s packed into an 8,
 *   16, 24, or 32-bit unsigned integer starting at the least- or
 *   most-significant bit;
 * * {@link module:Layout.cstr|C strings} of varying length;
 * * {@link module:Layout.blob|Blobs} of fixed- or variable-{@link
    *   module:Layout~Blob#length|length} raw data.
 *
 * All {@link module:Layout~Layout|Layout} instances are immutable
 * after construction, to prevent internal state from becoming
 * inconsistent.
 *
 * @local Layout
 * @local ExternalLayout
 * @local GreedyCount
 * @local OffsetLayout
 * @local UInt
 * @local UIntBE
 * @local Int
 * @local IntBE
 * @local NearUInt64
 * @local NearUInt64BE
 * @local NearInt64
 * @local NearInt64BE
 * @local Float
 * @local FloatBE
 * @local Double
 * @local DoubleBE
 * @local Sequence
 * @local Structure
 * @local UnionDiscriminator
 * @local UnionLayoutDiscriminator
 * @local Union
 * @local VariantLayout
 * @local BitStructure
 * @local BitField
 * @local Boolean
 * @local Blob
 * @local CString
 * @local Constant
 * @local bindConstructorLayout
 * @module Layout
 * @license MIT
 * @author Peter A. Bigot
 * @see {@link https://github.com/pabigot/buffer-layout|buffer-layout on GitHub}
 */

'use strict';

import {Buffer} from 'buffer';

/* Convenience type alias for objects.
 *
 * @ignore */
export interface LayoutObject {
    [key: string]: any;
}

/* Check if a value is a Uint8Array.
 *
 * @ignore */
export function checkUint8Array(b: Uint8Array): void {
    if (!(b instanceof Uint8Array)) {
        throw new TypeError('b must be a Uint8Array');
    }
}

/* Create a Buffer instance from a Uint8Array.
 *
 * @ignore */
export function uint8ArrayToBuffer(b: Uint8Array): Buffer {
    checkUint8Array(b);
    return Buffer.from(b.buffer, b.byteOffset, b.length);
}

/**
 * Base class for layout objects.
 *
 * **NOTE** This is an abstract base class; you can create instances
 * if it amuses you, but they won't support the {@link
    * Layout#encode|encode} or {@link Layout#decode|decode} functions.
 *
 * @param {Number} span - Initializer for {@link Layout#span|span}.  The
 * parameter must be an integer; a negative value signifies that the
 * span is {@link Layout#getSpan|value-specific}.
 *
 * @param {string} [property] - Initializer for {@link
    * Layout#property|property}.
 *
 * @abstract
 */
export abstract class Layout<T> {
    span: number;
    property?: string;
    boundConstructor_?: any;

    constructor(span: number, property?: string) {
        if (!Number.isInteger(span)) {
            throw new TypeError('span must be an integer');
        }

        /** The span of the layout in bytes.
         *
         * Positive values are generally expected.
         *
         * Zero will only appear in {@link Constant}s and in {@link
            * Sequence}s where the {@link Sequence#count|count} is zero.
         *
         * A negative value indicates that the span is value-specific, and
         * must be obtained using {@link Layout#getSpan|getSpan}. */
        this.span = span;

        /** The property name used when this layout is represented in an
         * Object.
         *
         * Used only for layouts that {@link Layout#decode|decode} to Object
         * instances.  If left undefined the span of the unnamed layout will
         * be treated as padding: it will not be mutated by {@link
            * Layout#encode|encode} nor represented as a property in the
         * decoded Object. */
        this.property = property;
    }

    /** Function to create an Object into which decoded properties will
     * be written.
     *
     * Used only for layouts that {@link Layout#decode|decode} to Object
     * instances, which means:
     * * {@link Structure}
     * * {@link Union}
     * * {@link VariantLayout}
     * * {@link BitStructure}
     *
     * If left undefined the JavaScript representation of these layouts
     * will be Object instances.
     *
     * See {@link bindConstructorLayout}.
     */
    makeDestinationObject(): LayoutObject {
        return {};
    }

    /**
     * Decode from a Uint8Array into a JavaScript value.
     *
     * @param {Uint8Array} b - the buffer from which encoded data is read.
     *
     * @param {Number} [offset] - the offset at which the encoded data
     * starts.  If absent a zero offset is inferred.
     *
     * @returns {(Number|Array|Object)} - the value of the decoded data.
     *
     * @abstract
     */
    abstract decode(b: Uint8Array, offset?: number): T;

    /**
     * Encode a JavaScript value into a Uint8Array.
     *
     * @param {(Number|Array|Object)} src - the value to be encoded into
     * the buffer.  The type accepted depends on the (sub-)type of {@link
        * Layout}.
     *
     * @param {Uint8Array} b - the buffer into which encoded data will be
     * written.
     *
     * @param {Number} [offset] - the offset at which the encoded data
     * starts.  If absent a zero offset is inferred.
     *
     * @returns {Number} - the number of bytes encoded, including the
     * space skipped for internal padding, but excluding data such as
     * {@link Sequence#count|lengths} when stored {@link
        * ExternalLayout|externally}.  This is the adjustment to `offset`
     * producing the offset where data for the next layout would be
     * written.
     *
     * @abstract
     */
    abstract encode(src: T, b: Uint8Array, offset?: number): number;

    /**
     * Calculate the span of a specific instance of a layout.
     *
     * @param {Uint8Array} b - the buffer that contains an encoded instance.
     *
     * @param {Number} [offset] - the offset at which the encoded instance
     * starts.  If absent a zero offset is inferred.
     *
     * @return {Number} - the number of bytes covered by the layout
     * instance.  If this method is not overridden in a subclass the
     * definition-time constant {@link Layout#span|span} will be
     * returned.
     *
     * @throws {RangeError} - if the length of the value cannot be
     * determined.
     */
    getSpan(b?: Uint8Array, offset?: number): number {
        if (0 > this.span) {
            throw new RangeError('indeterminate span');
        }
        return this.span;
    }

    /**
     * Replicate the layout using a new property.
     *
     * This function must be used to get a structurally-equivalent layout
     * with a different name since all {@link Layout} instances are
     * immutable.
     *
     * **NOTE** This is a shallow copy.  All fields except {@link
        * Layout#property|property} are strictly equal to the origin layout.
     *
     * @param {String} property - the value for {@link
        * Layout#property|property} in the replica.
     *
     * @returns {Layout} - the copy with {@link Layout#property|property}
     * set to `property`.
     */
    replicate(property: string): this {
        const rv = Object.create(this.constructor.prototype) as this;
        Object.assign(rv, this);
        rv.property = property;
        return rv;
    }

    /**
     * Create an object from layout properties and an array of values.
     *
     * **NOTE** This function returns `undefined` if invoked on a layout
     * that does not return its value as an Object.  Objects are
     * returned for things that are a {@link Structure}, which includes
     * {@link VariantLayout|variant layouts} if they are structures, and
     * excludes {@link Union}s.  If you want this feature for a union
     * you must use {@link Union.getVariant|getVariant} to select the
     * desired layout.
     *
     * @param {Array} values - an array of values that correspond to the
     * default order for properties.  As with {@link Layout#decode|decode}
     * layout elements that have no property name are skipped when
     * iterating over the array values.  Only the top-level properties are
     * assigned; arguments are not assigned to properties of contained
     * layouts.  Any unused values are ignored.
     *
     * @return {(Object|undefined)}
     */
    fromArray(values: any[]): LayoutObject | undefined {
        return undefined;
    }
}

/* Provide text that carries a name (such as for a function that will
 * be throwing an error) annotated with the property of a given layout
 * (such as one for which the value was unacceptable).
 *
 * @ignore */
export function nameWithProperty(name: string, lo: { property?: string }): string {
    if (lo.property) {
        return name + '[' + lo.property + ']';
    }
    return name;
}

/**
 * Augment a class so that instances can be encoded/decoded using a
 * given layout.
 *
 * Calling this function couples `Class` with `layout` in several ways:
 *
 * * `Class.layout_` becomes a static member property equal to `layout`;
 * * `layout.boundConstructor_` becomes a static member property equal
 *    to `Class`;
 * * The {@link Layout#makeDestinationObject|makeDestinationObject()}
 *   property of `layout` is set to a function that returns a `new
 *   Class()`;
 * * `Class.decode(b, offset)` becomes a static member function that
 *   delegates to {@link Layout#decode|layout.decode}.  The
 *   synthesized function may be captured and extended.
 * * `Class.prototype.encode(b, offset)` provides an instance member
 *   function that delegates to {@link Layout#encode|layout.encode}
 *   with `src` set to `this`.  The synthesized function may be
 *   captured and extended, but when the extension is invoked `this`
 *   must be explicitly bound to the instance.
 *
 * @param {class} Class - a JavaScript class with a nullary
 * constructor.
 *
 * @param {Layout} layout - the {@link Layout} instance used to encode
 * instances of `Class`.
 */
// `Class` must be a constructor Function, but the assignment of a `layout_` property to it makes it difficult to type
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function bindConstructorLayout<T>(Class: any, layout: Layout<T>): void {
    if ('function' !== typeof Class) {
        throw new TypeError('Class must be constructor');
    }
    if (Object.prototype.hasOwnProperty.call(Class, 'layout_')) {
        throw new Error('Class is already bound to a layout');
    }
    if (!(layout && (layout instanceof Layout))) {
        throw new TypeError('layout must be a Layout');
    }
    if (Object.prototype.hasOwnProperty.call(layout, 'boundConstructor_')) {
        throw new Error('layout is already bound to a constructor');
    }
    Class.layout_ = layout;
    layout.boundConstructor_ = Class;
    layout.makeDestinationObject = (() => new Class());
    Object.defineProperty(Class.prototype, 'encode', {
        value (b: Uint8Array, offset?: number): number {
            return layout.encode(this as T, b, offset);
        },
        writable: true,
    });
    Object.defineProperty(Class, 'decode', {
        value (b: Uint8Array, offset?: number): T {
            return layout.decode(b, offset);
        },
        writable: true,
    });
}

/**
 * An object that behaves like a layout but does not consume space
 * within its containing layout.
 *
 * This is primarily used to obtain metadata about a member, such as a
 * {@link OffsetLayout} that can provide data about a {@link
    * Layout#getSpan|value-specific span}.
 *
 * **NOTE** This is an abstract base class; you can create instances
 * if it amuses you, but they won't support {@link
    * ExternalLayout#isCount|isCount} or other {@link Layout} functions.
 *
 * @param {Number} span - initializer for {@link Layout#span|span}.
 * The parameter can range from 1 through 6.
 *
 * @param {string} [property] - initializer for {@link
    * Layout#property|property}.
 *
 * @abstract
 * @augments {Layout}
 */
export abstract class ExternalLayout extends Layout<number> {
    /**
     * Return `true` iff the external layout decodes to an unsigned
     * integer layout.
     *
     * In that case it can be used as the source of {@link
        * Sequence#count|Sequence counts}, {@link Blob#length|Blob lengths},
     * or as {@link UnionLayoutDiscriminator#layout|external union
   * discriminators}.
     *
     * @abstract
     */
    isCount(): boolean {
        throw new Error('ExternalLayout is abstract');
    }
}

/**
 * An {@link ExternalLayout} that determines its {@link
    * Layout#decode|value} based on offset into and length of the buffer
 * on which it is invoked.
 *
 * *Factory*: {@link module:Layout.greedy|greedy}
 *
 * @param {Number} [elementSpan] - initializer for {@link
    * GreedyCount#elementSpan|elementSpan}.
 *
 * @param {string} [property] - initializer for {@link
    * Layout#property|property}.
 *
 * @augments {ExternalLayout}
 */
export class GreedyCount extends ExternalLayout {
    elementSpan: number;

    constructor(elementSpan = 1, property?: string) {
        if ((!Number.isInteger(elementSpan)) || (0 >= elementSpan)) {
            throw new TypeError('elementSpan must be a (positive) integer');
        }
        super(-1, property);

        /** The layout for individual elements of the sequence.  The value
         * must be a positive integer.  If not provided, the value will be
         * 1. */
        this.elementSpan = elementSpan;
    }

    /** @override */
    isCount(): boolean {
        return true;
    }

    /** @override */
    decode(b: Uint8Array, offset = 0): number {
        checkUint8Array(b);
        const rem = b.length - offset;
        return Math.floor(rem / this.elementSpan);
    }

    /** @override */
    encode(src: number, b: Uint8Array, offset?: number): number {
        return 0;
    }
}

/**
 * An {@link ExternalLayout} that supports accessing a {@link Layout}
 * at a fixed offset from the start of another Layout.  The offset may
 * be before, within, or after the base layout.
 *
 * *Factory*: {@link module:Layout.offset|offset}
 *
 * @param {Layout} layout - initializer for {@link
    * OffsetLayout#layout|layout}, modulo `property`.
 *
 * @param {Number} [offset] - Initializes {@link
    * OffsetLayout#offset|offset}.  Defaults to zero.
 *
 * @param {string} [property] - Optional new property name for a
 * {@link Layout#replicate| replica} of `layout` to be used as {@link
    * OffsetLayout#layout|layout}.  If not provided the `layout` is used
 * unchanged.
 *
 * @augments {Layout}
 */
export class OffsetLayout extends ExternalLayout {
    layout: Layout<number>;
    offset: number;
    constructor(layout: Layout<number>, offset = 0, property?: string) {
        if (!(layout instanceof Layout)) {
            throw new TypeError('layout must be a Layout');
        }

        if (!Number.isInteger(offset)) {
            throw new TypeError('offset must be integer or undefined');
        }

        super(layout.span, property || layout.property);

        /** The subordinated layout. */
        this.layout = layout;

        /** The location of {@link OffsetLayout#layout} relative to the
         * start of another layout.
         *
         * The value may be positive or negative, but an error will thrown
         * if at the point of use it goes outside the span of the Uint8Array
         * being accessed.  */
        this.offset = offset;
    }

    /** @override */
    isCount(): boolean {
        return ((this.layout instanceof UInt)
            || (this.layout instanceof UIntBE));
    }

    /** @override */
    decode(b: Uint8Array, offset = 0): number {
        return this.layout.decode(b, offset + this.offset);
    }

    /** @override */
    encode(src: number, b: Uint8Array, offset = 0): number {
        return this.layout.encode(src, b, offset + this.offset);
    }
}

/**
 * Represent an unsigned integer in little-endian format.
 *
 * *Factory*: {@link module:Layout.u8|u8}, {@link
    *  module:Layout.u16|u16}, {@link module:Layout.u24|u24}, {@link
    *  module:Layout.u32|u32}, {@link module:Layout.u40|u40}, {@link
    *  module:Layout.u48|u48}
 *
 * @param {Number} span - initializer for {@link Layout#span|span}.
 * The parameter can range from 1 through 6.
 *
 * @param {string} [property] - initializer for {@link
    * Layout#property|property}.
 *
 * @augments {Layout}
 */
export class UInt extends Layout<number> {
    constructor(span: number, property?: string) {
        super(span, property);
        if (6 < this.span) {
            throw new RangeError('span must not exceed 6 bytes');
        }
    }

    /** @override */
    decode(b: Uint8Array, offset = 0): number {
        return uint8ArrayToBuffer(b).readUIntLE(offset, this.span);
    }

    /** @override */
    encode(src: number, b: Uint8Array, offset = 0): number {
        uint8ArrayToBuffer(b).writeUIntLE(src, offset, this.span);
        return this.span;
    }
}

/**
 * Represent an unsigned integer in big-endian format.
 *
 * *Factory*: {@link module:Layout.u8be|u8be}, {@link
    * module:Layout.u16be|u16be}, {@link module:Layout.u24be|u24be},
 * {@link module:Layout.u32be|u32be}, {@link
    * module:Layout.u40be|u40be}, {@link module:Layout.u48be|u48be}
 *
 * @param {Number} span - initializer for {@link Layout#span|span}.
 * The parameter can range from 1 through 6.
 *
 * @param {string} [property] - initializer for {@link
    * Layout#property|property}.
 *
 * @augments {Layout}
 */
export class UIntBE extends Layout<number> {
    constructor(span: number, property?: string) {
        super(span, property);
        if (6 < this.span) {
            throw new RangeError('span must not exceed 6 bytes');
        }
    }

    /** @override */
    decode(b: Uint8Array, offset = 0): number {
        return uint8ArrayToBuffer(b).readUIntBE(offset, this.span);
    }

    /** @override */
    encode(src: number, b: Uint8Array, offset = 0): number {
        uint8ArrayToBuffer(b).writeUIntBE(src, offset, this.span);
        return this.span;
    }
}

/**
 * Represent a signed integer in little-endian format.
 *
 * *Factory*: {@link module:Layout.s8|s8}, {@link
    *  module:Layout.s16|s16}, {@link module:Layout.s24|s24}, {@link
    *  module:Layout.s32|s32}, {@link module:Layout.s40|s40}, {@link
    *  module:Layout.s48|s48}
 *
 * @param {Number} span - initializer for {@link Layout#span|span}.
 * The parameter can range from 1 through 6.
 *
 * @param {string} [property] - initializer for {@link
    * Layout#property|property}.
 *
 * @augments {Layout}
 */
export class Int extends Layout<number> {
    constructor(span: number, property?: string) {
        super(span, property);
        if (6 < this.span) {
            throw new RangeError('span must not exceed 6 bytes');
        }
    }

    /** @override */
    decode(b: Uint8Array, offset = 0): number {
        return uint8ArrayToBuffer(b).readIntLE(offset, this.span);
    }

    /** @override */
    encode(src: number, b: Uint8Array, offset = 0): number {
        uint8ArrayToBuffer(b).writeIntLE(src, offset, this.span);
        return this.span;
    }
}

/**
 * Represent a signed integer in big-endian format.
 *
 * *Factory*: {@link module:Layout.s8be|s8be}, {@link
    * module:Layout.s16be|s16be}, {@link module:Layout.s24be|s24be},
 * {@link module:Layout.s32be|s32be}, {@link
    * module:Layout.s40be|s40be}, {@link module:Layout.s48be|s48be}
 *
 * @param {Number} span - initializer for {@link Layout#span|span}.
 * The parameter can range from 1 through 6.
 *
 * @param {string} [property] - initializer for {@link
    * Layout#property|property}.
 *
 * @augments {Layout}
 */
export class IntBE extends Layout<number> {
    constructor(span: number, property?: string) {
        super(span, property);
        if (6 < this.span) {
            throw new RangeError('span must not exceed 6 bytes');
        }
    }

    /** @override */
    decode(b: Uint8Array, offset = 0): number {
        return uint8ArrayToBuffer(b).readIntBE(offset, this.span);
    }

    /** @override */
    encode(src: number, b: Uint8Array, offset = 0): number {
        uint8ArrayToBuffer(b).writeIntBE(src, offset, this.span);
        return this.span;
    }
}

const V2E32 = Math.pow(2, 32);

/* True modulus high and low 32-bit words, where low word is always
 * non-negative. */
function divmodInt64(src: number): { hi32: number; lo32: number; } {
    const hi32 = Math.floor(src / V2E32);
    const lo32 = src - (hi32 * V2E32);
    return {hi32, lo32};
}
/* Reconstruct Number from quotient and non-negative remainder */
function roundedInt64(hi32: number, lo32: number): number {
    return hi32 * V2E32 + lo32;
}

/**
 * Represent an unsigned 64-bit integer in little-endian format when
 * encoded and as a near integral JavaScript Number when decoded.
 *
 * *Factory*: {@link module:Layout.nu64|nu64}
 *
 * **NOTE** Values with magnitude greater than 2^52 may not decode to
 * the exact value of the encoded representation.
 *
 * @augments {Layout}
 */
export class NearUInt64 extends Layout<number> {
    constructor(property?: string) {
        super(8, property);
    }

    /** @override */
    decode(b: Uint8Array, offset = 0): number {
        const buffer = uint8ArrayToBuffer(b);
        const lo32 = buffer.readUInt32LE(offset);
        const hi32 = buffer.readUInt32LE(offset + 4);
        return roundedInt64(hi32, lo32);
    }

    /** @override */
    encode(src: number, b: Uint8Array, offset = 0): number {
        const split = divmodInt64(src);
        const buffer = uint8ArrayToBuffer(b);
        buffer.writeUInt32LE(split.lo32, offset);
        buffer.writeUInt32LE(split.hi32, offset + 4);
        return 8;
    }
}

/**
 * Represent an unsigned 64-bit integer in big-endian format when
 * encoded and as a near integral JavaScript Number when decoded.
 *
 * *Factory*: {@link module:Layout.nu64be|nu64be}
 *
 * **NOTE** Values with magnitude greater than 2^52 may not decode to
 * the exact value of the encoded representation.
 *
 * @augments {Layout}
 */
export class NearUInt64BE extends Layout<number> {
    constructor(property?: string) {
        super(8, property);
    }

    /** @override */
    decode(b: Uint8Array, offset = 0): number {
        const buffer = uint8ArrayToBuffer(b);
        const hi32 = buffer.readUInt32BE(offset);
        const lo32 = buffer.readUInt32BE(offset + 4);
        return roundedInt64(hi32, lo32);
    }

    /** @override */
    encode(src: number, b: Uint8Array, offset = 0): number {
        const split = divmodInt64(src);
        const buffer = uint8ArrayToBuffer(b);
        buffer.writeUInt32BE(split.hi32, offset);
        buffer.writeUInt32BE(split.lo32, offset + 4);
        return 8;
    }
}

/**
 * Represent a signed 64-bit integer in little-endian format when
 * encoded and as a near integral JavaScript Number when decoded.
 *
 * *Factory*: {@link module:Layout.ns64|ns64}
 *
 * **NOTE** Values with magnitude greater than 2^52 may not decode to
 * the exact value of the encoded representation.
 *
 * @augments {Layout}
 */
export class NearInt64 extends Layout<number> {
    constructor(property?: string) {
        super(8, property);
    }

    /** @override */
    decode(b: Uint8Array, offset = 0): number {
        const buffer = uint8ArrayToBuffer(b);
        const lo32 = buffer.readUInt32LE(offset);
        const hi32 = buffer.readInt32LE(offset + 4);
        return roundedInt64(hi32, lo32);
    }

    /** @override */
    encode(src: number, b: Uint8Array, offset = 0): number {
        const split = divmodInt64(src);
        const buffer = uint8ArrayToBuffer(b);
        buffer.writeUInt32LE(split.lo32, offset);
        buffer.writeInt32LE(split.hi32, offset + 4);
        return 8;
    }
}

/**
 * Represent a signed 64-bit integer in big-endian format when
 * encoded and as a near integral JavaScript Number when decoded.
 *
 * *Factory*: {@link module:Layout.ns64be|ns64be}
 *
 * **NOTE** Values with magnitude greater than 2^52 may not decode to
 * the exact value of the encoded representation.
 *
 * @augments {Layout}
 */
export class NearInt64BE extends Layout<number> {
    constructor(property?: string) {
        super(8, property);
    }

    /** @override */
    decode(b: Uint8Array, offset = 0): number {
        const buffer = uint8ArrayToBuffer(b);
        const hi32 = buffer.readInt32BE(offset);
        const lo32 = buffer.readUInt32BE(offset + 4);
        return roundedInt64(hi32, lo32);
    }

    /** @override */
    encode(src: number, b: Uint8Array, offset = 0): number {
        const split = divmodInt64(src);
        const buffer = uint8ArrayToBuffer(b);
        buffer.writeInt32BE(split.hi32, offset);
        buffer.writeUInt32BE(split.lo32, offset + 4);
        return 8;
    }
}

/**
 * Represent a 32-bit floating point number in little-endian format.
 *
 * *Factory*: {@link module:Layout.f32|f32}
 *
 * @param {string} [property] - initializer for {@link
    * Layout#property|property}.
 *
 * @augments {Layout}
 */
export class Float extends Layout<number> {
    constructor(property?: string) {
        super(4, property);
    }

    /** @override */
    decode(b: Uint8Array, offset = 0): number {
        return uint8ArrayToBuffer(b).readFloatLE(offset);
    }

    /** @override */
    encode(src: number, b: Uint8Array, offset = 0): number {
        uint8ArrayToBuffer(b).writeFloatLE(src, offset);
        return 4;
    }
}

/**
 * Represent a 32-bit floating point number in big-endian format.
 *
 * *Factory*: {@link module:Layout.f32be|f32be}
 *
 * @param {string} [property] - initializer for {@link
    * Layout#property|property}.
 *
 * @augments {Layout}
 */
export class FloatBE extends Layout<number> {
    constructor(property?: string) {
        super(4, property);
    }

    /** @override */
    decode(b: Uint8Array, offset = 0): number {
        return uint8ArrayToBuffer(b).readFloatBE(offset);
    }

    /** @override */
    encode(src: number, b: Uint8Array, offset = 0): number {
        uint8ArrayToBuffer(b).writeFloatBE(src, offset);
        return 4;
    }
}

/**
 * Represent a 64-bit floating point number in little-endian format.
 *
 * *Factory*: {@link module:Layout.f64|f64}
 *
 * @param {string} [property] - initializer for {@link
    * Layout#property|property}.
 *
 * @augments {Layout}
 */
export class Double extends Layout<number> {
    constructor(property?: string) {
        super(8, property);
    }

    /** @override */
    decode(b: Uint8Array, offset = 0): number {
        return uint8ArrayToBuffer(b).readDoubleLE(offset);
    }

    /** @override */
    encode(src: number, b: Uint8Array, offset = 0): number {
        uint8ArrayToBuffer(b).writeDoubleLE(src, offset);
        return 8;
    }
}

/**
 * Represent a 64-bit floating point number in big-endian format.
 *
 * *Factory*: {@link module:Layout.f64be|f64be}
 *
 * @param {string} [property] - initializer for {@link
    * Layout#property|property}.
 *
 * @augments {Layout}
 */
export class DoubleBE extends Layout<number> {
    constructor(property?: string) {
        super(8, property);
    }

    /** @override */
    decode(b: Uint8Array, offset = 0): number {
        return uint8ArrayToBuffer(b).readDoubleBE(offset);
    }

    /** @override */
    encode(src: number, b: Uint8Array, offset = 0): number {
        uint8ArrayToBuffer(b).writeDoubleBE(src, offset);
        return 8;
    }
}

/**
 * Represent a contiguous sequence of a specific layout as an Array.
 *
 * *Factory*: {@link module:Layout.seq|seq}
 *
 * @param {Layout} elementLayout - initializer for {@link
    * Sequence#elementLayout|elementLayout}.
 *
 * @param {(Number|ExternalLayout)} count - initializer for {@link
    * Sequence#count|count}.  The parameter must be either a positive
 * integer or an instance of {@link ExternalLayout}.
 *
 * @param {string} [property] - initializer for {@link
    * Layout#property|property}.
 *
 * @augments {Layout}
 */
export class Sequence<T> extends Layout<T[]> {
    elementLayout: Layout<T>;
    count: number | ExternalLayout;

    constructor(elementLayout: Layout<T>, count: number | ExternalLayout, property?: string) {
        if (!(elementLayout instanceof Layout)) {
            throw new TypeError('elementLayout must be a Layout');
        }
        if (!(((count instanceof ExternalLayout) && count.isCount())
            || (Number.isInteger(count) && (0 <= count)))) {
            throw new TypeError('count must be non-negative integer '
                + 'or an unsigned integer ExternalLayout');
        }
        let span = -1;
        if ((!(count instanceof ExternalLayout))
            && (0 < elementLayout.span)) {
            span = count * elementLayout.span;
        }

        super(span, property);

        /** The layout for individual elements of the sequence. */
        this.elementLayout = elementLayout;

        /** The number of elements in the sequence.
         *
         * This will be either a non-negative integer or an instance of
         * {@link ExternalLayout} for which {@link
            * ExternalLayout#isCount|isCount()} is `true`. */
        this.count = count;
    }

    /** @override */
    getSpan(b: Uint8Array, offset = 0): number {
        if (0 <= this.span) {
            return this.span;
        }
        let span = 0;
        let count = this.count;
        if (count instanceof ExternalLayout) {
            count = count.decode(b, offset);
        }
        if (0 < this.elementLayout.span) {
            span = count * this.elementLayout.span;
        } else {
            let idx = 0;
            while (idx < count) {
                span += this.elementLayout.getSpan(b, offset + span);
                ++idx;
            }
        }
        return span;
    }

    /** @override */
    decode(b: Uint8Array, offset = 0): T[] {
        const rv: T[] = [];
        let i = 0;
        let count = this.count;
        if (count instanceof ExternalLayout) {
            count = count.decode(b, offset);
        }
        while (i < count) {
            rv.push(this.elementLayout.decode(b, offset));
            offset += this.elementLayout.getSpan(b, offset);
            i += 1;
        }
        return rv;
    }

    /** Implement {@link Layout#encode|encode} for {@link Sequence}.
     *
     * **NOTE** If `src` is shorter than {@link Sequence#count|count} then
     * the unused space in the buffer is left unchanged.  If `src` is
     * longer than {@link Sequence#count|count} the unneeded elements are
     * ignored.
     *
     * **NOTE** If {@link Layout#count|count} is an instance of {@link
        * ExternalLayout} then the length of `src` will be encoded as the
     * count after `src` is encoded. */
    encode(src: T[], b: Uint8Array, offset = 0): number {
        const elo = this.elementLayout;
        const span: number = src.reduce((span, v) => {
            return span + elo.encode(v, b, offset + span);
        }, 0);
        if (this.count instanceof ExternalLayout) {
            this.count.encode(src.length, b, offset);
        }
        return span;
    }
}

/**
 * Represent a contiguous sequence of arbitrary layout elements as an
 * Object.
 *
 * *Factory*: {@link module:Layout.struct|struct}
 *
 * **NOTE** The {@link Layout#span|span} of the structure is variable
 * if any layout in {@link Structure#fields|fields} has a variable
 * span.  When {@link Layout#encode|encoding} we must have a value for
 * all variable-length fields, or we wouldn't be able to figure out
 * how much space to use for storage.  We can only identify the value
 * for a field when it has a {@link Layout#property|property}.  As
 * such, although a structure may contain both unnamed fields and
 * variable-length fields, it cannot contain an unnamed
 * variable-length field.
 *
 * @param {Layout[]} fields - initializer for {@link
    * Structure#fields|fields}.  An error is raised if this contains a
 * variable-length field for which a {@link Layout#property|property}
 * is not defined.
 *
 * @param {string} [property] - initializer for {@link
    * Layout#property|property}.
 *
 * @param {Boolean} [decodePrefixes] - initializer for {@link
    * Structure#decodePrefixes|property}.
 *
 * @throws {Error} - if `fields` contains an unnamed variable-length
 * layout.
 *
 * @augments {Layout}
 */
export class Structure<T> extends Layout<T> {
    fields: Layout<T[keyof T]>[];
    decodePrefixes: boolean;

    constructor(fields: Layout<T[keyof T]>[], property?: string, decodePrefixes?: boolean) {
        if (!(Array.isArray(fields)
            && fields.reduce((acc, v) => acc && (v instanceof Layout), true))) {
            throw new TypeError('fields must be array of Layout instances');
        }
        if (('boolean' === typeof property)
            && (undefined === decodePrefixes)) {
            decodePrefixes = property;
            property = undefined;
        }

        /* Verify absence of unnamed variable-length fields. */
        for (const fd of fields) {
            if ((0 > fd.span)
                && (undefined === fd.property)) {
                throw new Error('fields cannot contain unnamed variable-length layout');
            }
        }

        let span = -1;
        try {
            span = fields.reduce((span, fd) => span + fd.getSpan(), 0);
        } catch (e) {
            // ignore error
        }
        super(span, property);

        /** The sequence of {@link Layout} values that comprise the
         * structure.
         *
         * The individual elements need not be the same type, and may be
         * either scalar or aggregate layouts.  If a member layout leaves
         * its {@link Layout#property|property} undefined the
         * corresponding region of the buffer associated with the element
         * will not be mutated.
         *
         * @type {Layout[]} */
        this.fields = fields;

        /** Control behavior of {@link Layout#decode|decode()} given short
         * buffers.
         *
         * In some situations a structure many be extended with additional
         * fields over time, with older installations providing only a
         * prefix of the full structure.  If this property is `true`
         * decoding will accept those buffers and leave subsequent fields
         * undefined, as long as the buffer ends at a field boundary.
         * Defaults to `false`. */
        this.decodePrefixes = !!decodePrefixes;
    }

    /** @override */
    getSpan(b: Uint8Array, offset = 0): number {
        if (0 <= this.span) {
            return this.span;
        }
        let span = 0;
        try {
            span = this.fields.reduce((span, fd) => {
                const fsp = fd.getSpan(b, offset);
                offset += fsp;
                return span + fsp;
            }, 0);
        } catch (e) {
            throw new RangeError('indeterminate span');
        }
        return span;
    }

    /** @override */
    decode(b: Uint8Array, offset = 0): T {
        checkUint8Array(b);
        const dest = this.makeDestinationObject() as T;
        for (const fd of this.fields) {
            if (undefined !== fd.property) {
                dest[fd.property as keyof T] = fd.decode(b, offset);
            }
            offset += fd.getSpan(b, offset);
            if (this.decodePrefixes
                && (b.length === offset)) {
                break;
            }
        }
        return dest;
    }

    /** Implement {@link Layout#encode|encode} for {@link Structure}.
     *
     * If `src` is missing a property for a member with a defined {@link
        * Layout#property|property} the corresponding region of the buffer is
     * left unmodified. */
    encode(src: T, b: Uint8Array, offset = 0): number {
        const firstOffset = offset;
        let lastOffset = 0;
        let lastWrote = 0;
        for (const fd of this.fields) {
            let span = fd.span;
            lastWrote = (0 < span) ? span : 0;
            if (undefined !== fd.property) {
                const fv = src[fd.property as keyof T];
                if (undefined !== fv) {
                    lastWrote = fd.encode(fv, b, offset);
                    if (0 > span) {
                        /* Read the as-encoded span, which is not necessarily the
                         * same as what we wrote. */
                        span = fd.getSpan(b, offset);
                    }
                }
            }
            lastOffset = offset;
            offset += span;
        }
        /* Use (lastOffset + lastWrote) instead of offset because the last
         * item may have had a dynamic length and we don't want to include
         * the padding between it and the end of the space reserved for
         * it. */
        return (lastOffset + lastWrote) - firstOffset;
    }

    /** @override */
    fromArray(values: any[]): LayoutObject {
        const dest = this.makeDestinationObject();
        for (const fd of this.fields) {
            if ((undefined !== fd.property)
                && (0 < values.length)) {
                dest[fd.property] = values.shift();
            }
        }
        return dest;
    }

    /**
     * Get access to the layout of a given property.
     *
     * @param {String} property - the structure member of interest.
     *
     * @return {Layout} - the layout associated with `property`, or
     * undefined if there is no such property.
     */
    // layoutFor(property: string): Layout<LayoutObject> | undefined {
    //     if ('string' !== typeof property) {
    //         throw new TypeError('property must be string');
    //     }
    //     for (const fd of this.fields) {
    //         if (fd.property === property) {
    //             return fd;
    //         }
    //     }
    //     return undefined;
    // }

    /**
     * Get the offset of a structure member.
     *
     * @param {String} property - the structure member of interest.
     *
     * @return {Number} - the offset in bytes to the start of `property`
     * within the structure, or undefined if `property` is not a field
     * within the structure.  If the property is a member but follows a
     * variable-length structure member a negative number will be
     * returned.
     */
    offsetOf(property: string): number | undefined {
        if ('string' !== typeof property) {
            throw new TypeError('property must be string');
        }
        let offset = 0;
        for (const fd of this.fields) {
            if (fd.property === property) {
                return offset;
            }
            if (0 > fd.span) {
                offset = -1;
            } else if (0 <= offset) {
                offset += fd.span;
            }
        }
        return undefined;
    }
}

/**
 * An object that can provide a {@link
    * Union#discriminator|discriminator} API for {@link Union}.
 *
 * **NOTE** This is an abstract base class; you can create instances
 * if it amuses you, but they won't support the {@link
    * UnionDiscriminator#encode|encode} or {@link
    * UnionDiscriminator#decode|decode} functions.
 *
 * @param {string} [property] - Default for {@link
    * UnionDiscriminator#property|property}.
 *
 * @abstract
 */
export class UnionDiscriminator<T = any> {
    property: string;
    constructor(property: string) {
        /** The {@link Layout#property|property} to be used when the
         * discriminator is referenced in isolation (generally when {@link
            * Union#decode|Union decode} cannot delegate to a specific
         * variant). */
        this.property = property;
    }

    /** Analog to {@link Layout#decode|Layout decode} for union discriminators.
     *
     * The implementation of this method need not reference the buffer if
     * variant information is available through other means. */
    decode(b?: Uint8Array, offset?: number): T {
        throw new Error('UnionDiscriminator is abstract');
    }

    /** Analog to {@link Layout#decode|Layout encode} for union discriminators.
     *
     * The implementation of this method need not store the value if
     * variant information is maintained through other means. */
    encode(src: T, b: Uint8Array, offset?: number): number {
        throw new Error('UnionDiscriminator is abstract');
    }
}

/**
 * An object that can provide a {@link
    * UnionDiscriminator|discriminator API} for {@link Union} using an
 * unsigned integral {@link Layout} instance located either inside or
 * outside the union.
 *
 * @param {ExternalLayout} layout - initializes {@link
    * UnionLayoutDiscriminator#layout|layout}.  Must satisfy {@link
    * ExternalLayout#isCount|isCount()}.
 *
 * @param {string} [property] - Default for {@link
    * UnionDiscriminator#property|property}, superseding the property
 * from `layout`, but defaulting to `variant` if neither `property`
 * nor layout provide a property name.
 *
 * @augments {UnionDiscriminator}
 */
export class UnionLayoutDiscriminator extends UnionDiscriminator<number> {
    layout: ExternalLayout;
    constructor(layout: ExternalLayout, property?: string) {
        if (!((layout instanceof ExternalLayout)
            && layout.isCount())) {
            throw new TypeError('layout must be an unsigned integer ExternalLayout');
        }

        super(property || layout.property || 'variant');

        /** The {@link ExternalLayout} used to access the discriminator
         * value. */
        this.layout = layout;
    }

    /** Delegate decoding to {@link UnionLayoutDiscriminator#layout|layout}. */
    decode(b: Uint8Array, offset?: number): number {
        return this.layout.decode(b, offset);
    }

    /** Delegate encoding to {@link UnionLayoutDiscriminator#layout|layout}. */
    encode(src: number, b: Uint8Array, offset?: number): number {
        return this.layout.encode(src, b, offset);
    }
}

/**
 * Represent any number of span-compatible layouts.
 *
 * *Factory*: {@link module:Layout.union|union}
 *
 * If the union has a {@link Union#defaultLayout|default layout} that
 * layout must have a non-negative {@link Layout#span|span}.  The span
 * of a fixed-span union includes its {@link
    * Union#discriminator|discriminator} if the variant is a {@link
    * Union#usesPrefixDiscriminator|prefix of the union}, plus the span
 * of its {@link Union#defaultLayout|default layout}.
 *
 * If the union does not have a default layout then the encoded span
 * of the union depends on the encoded span of its variant (which may
 * be fixed or variable).
 *
 * {@link VariantLayout#layout|Variant layout}s are added through
 * {@link Union#addVariant|addVariant}.  If the union has a default
 * layout, the span of the {@link VariantLayout#layout|layout
 * contained by the variant} must not exceed the span of the {@link
    * Union#defaultLayout|default layout} (minus the span of a {@link
    * Union#usesPrefixDiscriminator|prefix disriminator}, if used).  The
 * span of the variant will equal the span of the union itself.
 *
 * The variant for a buffer can only be identified from the {@link
    * Union#discriminator|discriminator} {@link
    * UnionDiscriminator#property|property} (in the case of the {@link
    * Union#defaultLayout|default layout}), or by using {@link
    * Union#getVariant|getVariant} and examining the resulting {@link
    * VariantLayout} instance.
 *
 * A variant compatible with a JavaScript object can be identified
 * using {@link Union#getSourceVariant|getSourceVariant}.
 *
 * @param {(UnionDiscriminator|ExternalLayout|Layout)} discr - How to
 * identify the layout used to interpret the union contents.  The
 * parameter must be an instance of {@link UnionDiscriminator}, an
 * {@link ExternalLayout} that satisfies {@link
    * ExternalLayout#isCount|isCount()}, or {@link UInt} (or {@link
    * UIntBE}).  When a non-external layout element is passed the layout
 * appears at the start of the union.  In all cases the (synthesized)
 * {@link UnionDiscriminator} instance is recorded as {@link
    * Union#discriminator|discriminator}.
 *
 * @param {(Layout|null)} defaultLayout - initializer for {@link
    * Union#defaultLayout|defaultLayout}.  If absent defaults to `null`.
 * If `null` there is no default layout: the union has data-dependent
 * length and attempts to decode or encode unrecognized variants will
 * throw an exception.  A {@link Layout} instance must have a
 * non-negative {@link Layout#span|span}, and if it lacks a {@link
    * Layout#property|property} the {@link
    * Union#defaultLayout|defaultLayout} will be a {@link
    * Layout#replicate|replica} with property `content`.
 *
 * @param {string} [property] - initializer for {@link
    * Layout#property|property}.
 *
 * @augments {Layout}
 */
export class Union extends Layout<LayoutObject> {
    // `property` is assigned in the Layout constructor
    // @ts-ignore
    property: string;
    discriminator: UnionDiscriminator;
    usesPrefixDiscriminator: boolean;
    defaultLayout: Layout<LayoutObject> | null;
    registry: {[key: number]: VariantLayout};

    getSourceVariant: (src: LayoutObject) => VariantLayout | undefined;
    configGetSourceVariant: (getSourceVariant: (src: LayoutObject) => VariantLayout | undefined) => void;

    constructor(
        discr: Layout<LayoutObject> | UnionDiscriminator,
        defaultLayout: Layout<LayoutObject> | null,
        property: string
    ) {
        let discriminator: UnionDiscriminator;
        if ((discr instanceof UInt)
            || (discr instanceof UIntBE)) {
            discriminator = new UnionLayoutDiscriminator(new OffsetLayout(discr));
        } else if ((discr instanceof ExternalLayout)
            && discr.isCount()) {
            discriminator = new UnionLayoutDiscriminator(discr);
        } else if (!(discr instanceof UnionDiscriminator)) {
            throw new TypeError('discr must be a UnionDiscriminator '
                + 'or an unsigned integer layout');
        } else {
            discriminator = discr;
        }
        if (undefined === defaultLayout) {
            defaultLayout = null;
        }
        if (!((null === defaultLayout)
            || (defaultLayout instanceof Layout))) {
            throw new TypeError('defaultLayout must be null or a Layout');
        }
        if (null !== defaultLayout) {
            if (0 > defaultLayout.span) {
                throw new Error('defaultLayout must have constant span');
            }
            if (undefined === defaultLayout.property) {
                defaultLayout = defaultLayout.replicate('content');
            }
        }

        /* The union span can be estimated only if there's a default
         * layout.  The union spans its default layout, plus any prefix
         * variant layout.  By construction both layouts, if present, have
         * non-negative span. */
        let span = -1;
        if (defaultLayout) {
            span = defaultLayout.span;
            if ((0 <= span) && ((discr instanceof UInt)
                || (discr instanceof UIntBE))) {
                span += (discriminator as UnionLayoutDiscriminator).layout.span;
            }
        }
        super(span, property);

        /** The interface for the discriminator value in isolation.
         *
         * This a {@link UnionDiscriminator} either passed to the
         * constructor or synthesized from the `discr` constructor
         * argument.  {@link
            * Union#usesPrefixDiscriminator|usesPrefixDiscriminator} will be
         * `true` iff the `discr` parameter was a non-offset {@link
            * Layout} instance. */
        this.discriminator = discriminator;

        /** `true` if the {@link Union#discriminator|discriminator} is the
         * first field in the union.
         *
         * If `false` the discriminator is obtained from somewhere
         * else. */
        this.usesPrefixDiscriminator = (discr instanceof UInt)
            || (discr instanceof UIntBE);

        /** The layout for non-discriminator content when the value of the
         * discriminator is not recognized.
         *
         * This is the value passed to the constructor.  It is
         * structurally equivalent to the second component of {@link
            * Union#layout|layout} but may have a different property
         * name. */
        this.defaultLayout = defaultLayout;

        /** A registry of allowed variants.
         *
         * The keys are unsigned integers which should be compatible with
         * {@link Union.discriminator|discriminator}.  The property value
         * is the corresponding {@link VariantLayout} instances assigned
         * to this union by {@link Union#addVariant|addVariant}.
         *
         * **NOTE** The registry remains mutable so that variants can be
         * {@link Union#addVariant|added} at any time.  Users should not
         * manipulate the content of this property. */
        this.registry = {};

        /* Private variable used when invoking getSourceVariant */
        let boundGetSourceVariant = this.defaultGetSourceVariant.bind(this);

        /** Function to infer the variant selected by a source object.
         *
         * Defaults to {@link
            * Union#defaultGetSourceVariant|defaultGetSourceVariant} but may
         * be overridden using {@link
            * Union#configGetSourceVariant|configGetSourceVariant}.
         *
         * @param {Object} src - as with {@link
            * Union#defaultGetSourceVariant|defaultGetSourceVariant}.
         *
         * @returns {(undefined|VariantLayout)} The default variant
         * (`undefined`) or first registered variant that uses a property
         * available in `src`. */
        this.getSourceVariant = function(src) {
            return boundGetSourceVariant(src);
        };

        /** Function to override the implementation of {@link
            * Union#getSourceVariant|getSourceVariant}.
         *
         * Use this if the desired variant cannot be identified using the
         * algorithm of {@link
            * Union#defaultGetSourceVariant|defaultGetSourceVariant}.
         *
         * **NOTE** The provided function will be invoked bound to this
         * Union instance, providing local access to {@link
            * Union#registry|registry}.
         *
         * @param {Function} gsv - a function that follows the API of
         * {@link Union#defaultGetSourceVariant|defaultGetSourceVariant}. */
        this.configGetSourceVariant = function(gsv) {
            boundGetSourceVariant = gsv.bind(this);
        };
    }

    /** @override */
    getSpan(b: Uint8Array, offset = 0): number {
        if (0 <= this.span) {
            return this.span;
        }
        /* Default layouts always have non-negative span, so we don't have
         * one and we have to recognize the variant which will in turn
         * determine the span. */
        const vlo = this.getVariant(b, offset);
        if (!vlo) {
            throw new Error('unable to determine span for unrecognized variant');
        }
        return vlo.getSpan(b, offset);
    }

    /**
     * Method to infer a registered Union variant compatible with `src`.
     *
     * The first satisfied rule in the following sequence defines the
     * return value:
     * * If `src` has properties matching the Union discriminator and
     *   the default layout, `undefined` is returned regardless of the
     *   value of the discriminator property (this ensures the default
     *   layout will be used);
     * * If `src` has a property matching the Union discriminator, the
     *   value of the discriminator identifies a registered variant, and
     *   either (a) the variant has no layout, or (b) `src` has the
     *   variant's property, then the variant is returned (because the
     *   source satisfies the constraints of the variant it identifies);
     * * If `src` does not have a property matching the Union
     *   discriminator, but does have a property matching a registered
     *   variant, then the variant is returned (because the source
     *   matches a variant without an explicit conflict);
     * * An error is thrown (because we either can't identify a variant,
     *   or we were explicitly told the variant but can't satisfy it).
     *
     * @param {Object} src - an object presumed to be compatible with
     * the content of the Union.
     *
     * @return {(undefined|VariantLayout)} - as described above.
     *
     * @throws {Error} - if `src` cannot be associated with a default or
     * registered variant.
     */
    defaultGetSourceVariant(src: LayoutObject): VariantLayout | undefined {
        if (Object.prototype.hasOwnProperty.call(src, this.discriminator.property)) {
            if (this.defaultLayout && this.defaultLayout.property
                && Object.prototype.hasOwnProperty.call(src, this.defaultLayout.property)) {
                return undefined;
            }
            const vlo = this.registry[src[this.discriminator.property]];
            if (vlo
                && ((!vlo.layout)
                    || (vlo.property && Object.prototype.hasOwnProperty.call(src, vlo.property)))) {
                return vlo;
            }
        } else {
            for (const tag in this.registry) {
                const vlo = this.registry[tag];
                if (vlo.property && Object.prototype.hasOwnProperty.call(src, vlo.property)) {
                    return vlo;
                }
            }
        }
        throw new Error('unable to infer src variant');
    }

    /** Implement {@link Layout#decode|decode} for {@link Union}.
     *
     * If the variant is {@link Union#addVariant|registered} the return
     * value is an instance of that variant, with no explicit
     * discriminator.  Otherwise the {@link Union#defaultLayout|default
   * layout} is used to decode the content. */
    decode(b: Uint8Array, offset = 0): LayoutObject {
        let dest: LayoutObject;
        const dlo = this.discriminator;
        const discr = dlo.decode(b, offset);
        const clo = this.registry[discr];
        if (undefined === clo) {
            const defaultLayout = this.defaultLayout;
            let contentOffset = 0;
            if (this.usesPrefixDiscriminator) {
                contentOffset = (dlo as UnionLayoutDiscriminator).layout.span;
            }
            dest = this.makeDestinationObject();
            dest[dlo.property] = discr;
            // defaultLayout.property can be undefined, but this is allowed by buffer-layout
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            dest[defaultLayout!.property!] = defaultLayout!.decode(b, offset + contentOffset);
        } else {
            dest = clo.decode(b, offset);
        }
        return dest;
    }

    /** Implement {@link Layout#encode|encode} for {@link Union}.
     *
     * This API assumes the `src` object is consistent with the union's
     * {@link Union#defaultLayout|default layout}.  To encode variants
     * use the appropriate variant-specific {@link VariantLayout#encode}
     * method. */
    encode(src: LayoutObject, b: Uint8Array, offset = 0): number {
        const vlo = this.getSourceVariant(src);
        if (undefined === vlo) {
            const dlo = this.discriminator;
            // this.defaultLayout is not undefined when vlo is undefined
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const clo = this.defaultLayout!;
            let contentOffset = 0;
            if (this.usesPrefixDiscriminator) {
                contentOffset = (dlo as UnionLayoutDiscriminator).layout.span;
            }
            dlo.encode(src[dlo.property], b, offset);
            // clo.property is not undefined when vlo is undefined
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return contentOffset + clo.encode(src[clo.property!], b, offset + contentOffset);
        }
        return vlo.encode(src, b, offset);
    }

    /** Register a new variant structure within a union.  The newly
     * created variant is returned.
     *
     * @param {Number} variant - initializer for {@link
        * VariantLayout#variant|variant}.
     *
     * @param {Layout} layout - initializer for {@link
        * VariantLayout#layout|layout}.
     *
     * @param {String} property - initializer for {@link
        * Layout#property|property}.
     *
     * @return {VariantLayout} */
    addVariant(variant: number, layout: Layout<LayoutObject>, property: string): VariantLayout {
        const rv = new VariantLayout(this, variant, layout, property);
        this.registry[variant] = rv;
        return rv;
    }

    /**
     * Get the layout associated with a registered variant.
     *
     * If `vb` does not produce a registered variant the function returns
     * `undefined`.
     *
     * @param {(Number|Uint8Array)} vb - either the variant number, or a
     * buffer from which the discriminator is to be read.
     *
     * @param {Number} offset - offset into `vb` for the start of the
     * union.  Used only when `vb` is an instance of {Uint8Array}.
     *
     * @return {({VariantLayout}|undefined)}
     */
    getVariant(vb: Uint8Array | number, offset = 0): VariantLayout | undefined {
        let variant: number;
        if (vb instanceof Uint8Array) {
            variant = this.discriminator.decode(vb, offset);
        } else {
            variant = vb;
        }
        return this.registry[variant];
    }
}

/**
 * Represent a specific variant within a containing union.
 *
 * **NOTE** The {@link Layout#span|span} of the variant may include
 * the span of the {@link Union#discriminator|discriminator} used to
 * identify it, but values read and written using the variant strictly
 * conform to the content of {@link VariantLayout#layout|layout}.
 *
 * **NOTE** User code should not invoke this constructor directly.  Use
 * the union {@link Union#addVariant|addVariant} helper method.
 *
 * @param {Union} union - initializer for {@link
    * VariantLayout#union|union}.
 *
 * @param {Number} variant - initializer for {@link
    * VariantLayout#variant|variant}.
 *
 * @param {Layout} [layout] - initializer for {@link
    * VariantLayout#layout|layout}.  If absent the variant carries no
 * data.
 *
 * @param {String} [property] - initializer for {@link
    * Layout#property|property}.  Unlike many other layouts, variant
 * layouts normally include a property name so they can be identified
 * within their containing {@link Union}.  The property identifier may
 * be absent only if `layout` is is absent.
 *
 * @augments {Layout}
 */
export class VariantLayout extends Layout<LayoutObject> {
    // `property` is assigned in the Layout constructor
    // @ts-ignore
    property: string;
    union: Union;
    variant: number;
    layout: Layout<LayoutObject> | null;
    constructor(union: Union, variant: number, layout: Layout<LayoutObject> | null, property: string) {
        if (!(union instanceof Union)) {
            throw new TypeError('union must be a Union');
        }
        if ((!Number.isInteger(variant)) || (0 > variant)) {
            throw new TypeError('variant must be a (non-negative) integer');
        }
        if (('string' === typeof layout)
            && (undefined === property)) {
            property = layout;
            layout = null;
        }
        if (layout) {
            if (!(layout instanceof Layout)) {
                throw new TypeError('layout must be a Layout');
            }
            if ((null !== union.defaultLayout)
                && (0 <= layout.span)
                && (layout.span > union.defaultLayout.span)) {
                throw new Error('variant span exceeds span of containing union');
            }
            if ('string' !== typeof property) {
                throw new TypeError('variant must have a String property');
            }
        }
        let span = union.span;
        if (0 > union.span) {
            span = layout ? layout.span : 0;
            if ((0 <= span) && union.usesPrefixDiscriminator) {
                span += (union.discriminator as UnionLayoutDiscriminator).layout.span;
            }
        }
        super(span, property);

        /** The {@link Union} to which this variant belongs. */
        this.union = union;

        /** The unsigned integral value identifying this variant within
         * the {@link Union#discriminator|discriminator} of the containing
         * union. */
        this.variant = variant;

        /** The {@link Layout} to be used when reading/writing the
         * non-discriminator part of the {@link
            * VariantLayout#union|union}.  If `null` the variant carries no
         * data. */
        this.layout = layout || null;
    }

    /** @override */
    getSpan(b: Uint8Array, offset = 0): number {
        if (0 <= this.span) {
            /* Will be equal to the containing union span if that is not
             * variable. */
            return this.span;
        }
        let contentOffset = 0;
        if (this.union.usesPrefixDiscriminator) {
            contentOffset = (this.union.discriminator as UnionLayoutDiscriminator).layout.span;
        }
        /* Span is defined solely by the variant (and prefix discriminator) */
        let span = 0;
        if (this.layout) {
            span = this.layout.getSpan(b, offset + contentOffset);
        }
        return contentOffset + span;
    }

    /** @override */
    decode(b: Uint8Array, offset = 0): LayoutObject {
        const dest = this.makeDestinationObject();
        if (this !== this.union.getVariant(b, offset)) {
            throw new Error('variant mismatch');
        }
        let contentOffset = 0;
        if (this.union.usesPrefixDiscriminator) {
            contentOffset = (this.union.discriminator as UnionLayoutDiscriminator).layout.span;
        }
        if (this.layout) {
            dest[this.property] = this.layout.decode(b, offset + contentOffset);
        } else if (this.property) {
            dest[this.property] = true;
        } else if (this.union.usesPrefixDiscriminator) {
            dest[this.union.discriminator.property] = this.variant;
        }
        return dest;
    }

    /** @override */
    encode(src: LayoutObject, b: Uint8Array, offset = 0): number {
        let contentOffset = 0;
        if (this.union.usesPrefixDiscriminator) {
            contentOffset = (this.union.discriminator as UnionLayoutDiscriminator).layout.span;
        }
        if (this.layout
            && (!Object.prototype.hasOwnProperty.call(src, this.property))) {
            throw new TypeError('variant lacks property ' + this.property);
        }
        this.union.discriminator.encode(this.variant, b, offset);
        let span = contentOffset;
        if (this.layout) {
            this.layout.encode(src[this.property], b, offset + contentOffset);
            span += this.layout.getSpan(b, offset + contentOffset);
            if ((0 <= this.union.span)
                && (span > this.union.span)) {
                throw new Error('encoded variant overruns containing union');
            }
        }
        return span;
    }

    /** Delegate {@link Layout#fromArray|fromArray} to {@link
        * VariantLayout#layout|layout}. */
    fromArray(values: any[]): LayoutObject | undefined {
        if (this.layout) {
            return this.layout.fromArray(values);
        }
        return undefined;
    }
}

/** JavaScript chose to define bitwise operations as operating on
 * signed 32-bit values in 2's complement form, meaning any integer
 * with bit 31 set is going to look negative.  For right shifts that's
 * not a problem, because `>>>` is a logical shift, but for every
 * other bitwise operator we have to compensate for possible negative
 * results. */
function fixBitwiseResult(v: number): number {
    if (0 > v) {
        v += 0x100000000;
    }
    return v;
}

/**
 * Contain a sequence of bit fields as an unsigned integer.
 *
 * *Factory*: {@link module:Layout.bits|bits}
 *
 * This is a container element; within it there are {@link BitField}
 * instances that provide the extracted properties.  The container
 * simply defines the aggregate representation and its bit ordering.
 * The representation is an object containing properties with numeric
 * or {@link Boolean} values.
 *
 * {@link BitField}s are added with the {@link
    * BitStructure#addField|addField} and {@link
    * BitStructure#addBoolean|addBoolean} methods.
 * @param {Layout} word - initializer for {@link
    * BitStructure#word|word}.  The parameter must be an instance of
 * {@link UInt} (or {@link UIntBE}) that is no more than 4 bytes wide.
 *
 * @param {bool} [msb] - `true` if the bit numbering starts at the
 * most significant bit of the containing word; `false` (default) if
 * it starts at the least significant bit of the containing word.  If
 * the parameter at this position is a string and `property` is
 * `undefined` the value of this argument will instead be used as the
 * value of `property`.
 *
 * @param {string} [property] - initializer for {@link
    * Layout#property|property}.
 *
 * @augments {Layout}
 */
export class BitStructure extends Layout<LayoutObject> {
    fields: BitField[];
    word: UInt | UIntBE;
    msb: boolean;

    _packedSetValue: (v: number) => this;
    _packedGetValue: () => number;

    constructor(word: UInt | UIntBE, msb: boolean | string, property?: string) {
        if (!((word instanceof UInt)
            || (word instanceof UIntBE))) {
            throw new TypeError('word must be a UInt or UIntBE layout');
        }
        if (('string' === typeof msb)
            && (undefined === property)) {
            property = msb;
            msb = false;
        }
        if (4 < word.span) {
            throw new RangeError('word cannot exceed 32 bits');
        }
        super(word.span, property);

        /** The layout used for the packed value.  {@link BitField}
         * instances are packed sequentially depending on {@link
            * BitStructure#msb|msb}. */
        this.word = word;

        /** Whether the bit sequences are packed starting at the most
         * significant bit growing down (`true`), or the least significant
         * bit growing up (`false`).
         *
         * **NOTE** Regardless of this value, the least significant bit of
         * any {@link BitField} value is the least significant bit of the
         * corresponding section of the packed value. */
        this.msb = !!msb;

        /** The sequence of {@link BitField} layouts that comprise the
         * packed structure.
         *
         * **NOTE** The array remains mutable to allow fields to be {@link
            * BitStructure#addField|added} after construction.  Users should
         * not manipulate the content of this property.*/
        this.fields = [];

        /* Storage for the value.  Capture a variable instead of using an
         * instance property because we don't want anything to change the
         * value without going through the mutator. */
        let value = 0;
        this._packedSetValue = function(v: number) {
            value = fixBitwiseResult(v);
            return this;
        };
        this._packedGetValue = function() {
            return value;
        };
    }

    /** @override */
    decode(b: Uint8Array, offset = 0): LayoutObject {
        const dest = this.makeDestinationObject();
        const value = this.word.decode(b, offset);
        this._packedSetValue(value);
        for (const fd of this.fields) {
            if (undefined !== fd.property) {
                dest[fd.property] = fd.decode(b);
            }
        }
        return dest;
    }

    /** Implement {@link Layout#encode|encode} for {@link BitStructure}.
     *
     * If `src` is missing a property for a member with a defined {@link
        * Layout#property|property} the corresponding region of the packed
     * value is left unmodified.  Unused bits are also left unmodified. */
    encode(src: LayoutObject, b: Uint8Array, offset = 0): number {
        const value = this.word.decode(b, offset);
        this._packedSetValue(value);
        for (const fd of this.fields) {
            if (undefined !== fd.property) {
                const fv = src[fd.property];
                if (undefined !== fv) {
                    fd.encode(fv);
                }
            }
        }
        return this.word.encode(this._packedGetValue(), b, offset);
    }

    /** Register a new bitfield with a containing bit structure.  The
     * resulting bitfield is returned.
     *
     * @param {Number} bits - initializer for {@link BitField#bits|bits}.
     *
     * @param {string} property - initializer for {@link
        * Layout#property|property}.
     *
     * @return {BitField} */
    addField(bits: number, property: string): BitField {
        const bf = new BitField(this, bits, property);
        this.fields.push(bf);
        return bf;
    }

    /** As with {@link BitStructure#addField|addField} for single-bit
     * fields with `boolean` value representation.
     *
     * @param {string} property - initializer for {@link
        * Layout#property|property}.
     *
     * @return {Boolean} */
    // `Boolean` conflicts with the native primitive type
    // eslint-disable-next-line @typescript-eslint/ban-types
    addBoolean(property: string): Boolean {
        // This is my Boolean, not the Javascript one.
        const bf = new Boolean(this, property);
        this.fields.push(bf);
        return bf;
    }

    /**
     * Get access to the bit field for a given property.
     *
     * @param {String} property - the bit field of interest.
     *
     * @return {BitField} - the field associated with `property`, or
     * undefined if there is no such property.
     */
    fieldFor(property: string): BitField | undefined {
        if ('string' !== typeof property) {
            throw new TypeError('property must be string');
        }
        for (const fd of this.fields) {
            if (fd.property === property) {
                return fd;
            }
        }
        return undefined;
    }
}

/**
 * Represent a sequence of bits within a {@link BitStructure}.
 *
 * All bit field values are represented as unsigned integers.
 *
 * **NOTE** User code should not invoke this constructor directly.
 * Use the container {@link BitStructure#addField|addField} helper
 * method.
 *
 * **NOTE** BitField instances are not instances of {@link Layout}
 * since {@link Layout#span|span} measures 8-bit units.
 *
 * @param {BitStructure} container - initializer for {@link
    * BitField#container|container}.
 *
 * @param {Number} bits - initializer for {@link BitField#bits|bits}.
 *
 * @param {string} [property] - initializer for {@link
    * Layout#property|property}.
 */
export class BitField {
    container: BitStructure;
    bits: number;
    valueMask: number;
    start: number;
    wordMask: number;
    property: string;
    constructor(container: BitStructure, bits: number, property: string) {
        if (!(container instanceof BitStructure)) {
            throw new TypeError('container must be a BitStructure');
        }
        if ((!Number.isInteger(bits)) || (0 >= bits)) {
            throw new TypeError('bits must be positive integer');
        }
        const totalBits = 8 * container.span;
        const usedBits = container.fields.reduce((sum, fd) => sum + fd.bits, 0);
        if ((bits + usedBits) > totalBits) {
            throw new Error('bits too long for span remainder ('
                + (totalBits - usedBits) + ' of '
                + totalBits + ' remain)');
        }

        /** The {@link BitStructure} instance to which this bit field
         * belongs. */
        this.container = container;

        /** The span of this value in bits. */
        this.bits = bits;

        /** A mask of {@link BitField#bits|bits} bits isolating value bits
         * that fit within the field.
         *
         * That is, it masks a value that has not yet been shifted into
         * position within its containing packed integer. */
        this.valueMask = (1 << bits) - 1;
        if (32 === bits) { // shifted value out of range
            this.valueMask = 0xFFFFFFFF;
        }

        /** The offset of the value within the containing packed unsigned
         * integer.  The least significant bit of the packed value is at
         * offset zero, regardless of bit ordering used. */
        this.start = usedBits;
        if (this.container.msb) {
            this.start = totalBits - usedBits - bits;
        }

        /** A mask of {@link BitField#bits|bits} isolating the field value
         * within the containing packed unsigned integer. */
        this.wordMask = fixBitwiseResult(this.valueMask << this.start);

        /** The property name used when this bitfield is represented in an
         * Object.
         *
         * Intended to be functionally equivalent to {@link
            * Layout#property}.
         *
         * If left undefined the corresponding span of bits will be
         * treated as padding: it will not be mutated by {@link
            * Layout#encode|encode} nor represented as a property in the
         * decoded Object. */
        this.property = property;
    }

    /** Store a value into the corresponding subsequence of the containing
     * bit field. */
    decode(b?: Uint8Array, offset?: number): unknown {
        const word = this.container._packedGetValue();
        const wordValue = fixBitwiseResult(word & this.wordMask);
        const value = wordValue >>> this.start;
        return value;
    }

    /** Store a value into the corresponding subsequence of the containing
     * bit field.
     *
     * **NOTE** This is not a specialization of {@link
        * Layout#encode|Layout.encode} and there is no return value. */
    encode(value: unknown): void {
        if ('number' !== typeof value
            || !Number.isInteger(value)
            || (value !== fixBitwiseResult(value & this.valueMask))) {
            throw new TypeError(nameWithProperty('BitField.encode', this)
                + ' value must be integer not exceeding ' + this.valueMask);
        }
        const word = this.container._packedGetValue();
        const wordValue = fixBitwiseResult(value << this.start);
        this.container._packedSetValue(fixBitwiseResult(word & ~this.wordMask)
            | wordValue);
    }
}

/**
 * Represent a single bit within a {@link BitStructure} as a
 * JavaScript boolean.
 *
 * **NOTE** User code should not invoke this constructor directly.
 * Use the container {@link BitStructure#addBoolean|addBoolean} helper
 * method.
 *
 * @param {BitStructure} container - initializer for {@link
    * BitField#container|container}.
 *
 * @param {string} [property] - initializer for {@link
    * Layout#property|property}.
 *
 * @augments {BitField}
 */
/* eslint-disable no-extend-native */
export class Boolean extends BitField {
    constructor(container: BitStructure, property: string) {
        super(container, 1, property);
    }

    /** Override {@link BitField#decode|decode} for {@link Boolean|Boolean}.
     *
     * @returns {boolean} */
    decode(b?: Uint8Array, offset?: number): boolean {
        return !!super.decode(b, offset);
    }

    /** @override */
    encode(value: number | boolean): void {
        if ('boolean' === typeof value) {
            // BitField requires integer values
            value = +value;
        }
        super.encode(value);
    }
}
/* eslint-enable no-extend-native */

/**
 * Contain a fixed-length block of arbitrary data, represented as a
 * Uint8Array.
 *
 * *Factory*: {@link module:Layout.blob|blob}
 *
 * @param {(Number|ExternalLayout)} length - initializes {@link
    * Blob#length|length}.
 *
 * @param {String} [property] - initializer for {@link
    * Layout#property|property}.
 *
 * @augments {Layout}
 */
export class Blob extends Layout<Uint8Array> {
    length: number | ExternalLayout;
    constructor(length: number | ExternalLayout, property?: string) {
        if (!(((length instanceof ExternalLayout) && length.isCount())
            || (Number.isInteger(length) && (0 <= length)))) {
            throw new TypeError('length must be positive integer '
                + 'or an unsigned integer ExternalLayout');
        }

        let span = -1;
        if (!(length instanceof ExternalLayout)) {
            span = length;
        }
        super(span, property);

        /** The number of bytes in the blob.
         *
         * This may be a non-negative integer, or an instance of {@link
            * ExternalLayout} that satisfies {@link
            * ExternalLayout#isCount|isCount()}. */
        this.length = length;
    }

    /** @override */
    getSpan(b: Uint8Array, offset?: number): number {
        let span = this.span;
        if (0 > span) {
            span = (this.length as ExternalLayout).decode(b, offset);
        }
        return span;
    }

    /** @override */
    decode(b: Uint8Array, offset = 0): Uint8Array {
        let span = this.span;
        if (0 > span) {
            span = (this.length as ExternalLayout).decode(b, offset);
        }
        return uint8ArrayToBuffer(b).slice(offset, offset + span);
    }

    /** Implement {@link Layout#encode|encode} for {@link Blob}.
     *
     * **NOTE** If {@link Layout#count|count} is an instance of {@link
        * ExternalLayout} then the length of `src` will be encoded as the
     * count after `src` is encoded. */
    encode(src: Uint8Array, b: Uint8Array, offset: number): number {
        let span = this.length;
        if (this.length instanceof ExternalLayout) {
            span = src.length;
        }
        if (!(src instanceof Uint8Array && span === src.length)) {
            throw new TypeError(nameWithProperty('Blob.encode', this)
                + ' requires (length ' + span + ') Uint8Array as src');
        }
        if ((offset + span) > b.length) {
            throw new RangeError('encoding overruns Uint8Array');
        }
        const srcBuffer = uint8ArrayToBuffer(src);
        uint8ArrayToBuffer(b).write(srcBuffer.toString('hex'), offset, span, 'hex');
        if (this.length instanceof ExternalLayout) {
            this.length.encode(span, b, offset);
        }
        return span;
    }
}

/**
 * Contain a `NUL`-terminated UTF8 string.
 *
 * *Factory*: {@link module:Layout.cstr|cstr}
 *
 * **NOTE** Any UTF8 string that incorporates a zero-valued byte will
 * not be correctly decoded by this layout.
 *
 * @param {String} [property] - initializer for {@link
    * Layout#property|property}.
 *
 * @augments {Layout}
 */
export class CString extends Layout<string> {
    constructor(property?: string) {
        super(-1, property);
    }

    /** @override */
    getSpan(b: Uint8Array, offset = 0): number {
        checkUint8Array(b);
        let idx = offset;
        while ((idx < b.length) && (0 !== b[idx])) {
            idx += 1;
        }
        return 1 + idx - offset;
    }

    /** @override */
    decode(b: Uint8Array, offset = 0): string {
        const span = this.getSpan(b, offset);
        return uint8ArrayToBuffer(b).slice(offset, offset + span - 1).toString('utf-8');
    }

    /** @override */
    encode(src: string, b: Uint8Array, offset = 0): number {
        /* Must force this to a string, lest it be a number and the
         * "utf8-encoding" below actually allocate a buffer of length
         * src */
        if ('string' !== typeof src) {
            src = String(src);
        }
        const srcb = Buffer.from(src, 'utf8');
        const span = srcb.length;
        if ((offset + span) > b.length) {
            throw new RangeError('encoding overruns Buffer');
        }
        const buffer = uint8ArrayToBuffer(b);
        srcb.copy(buffer, offset);
        buffer[offset + span] = 0;
        return span + 1;
    }
}

/**
 * Contain a UTF8 string with implicit length.
 *
 * *Factory*: {@link module:Layout.utf8|utf8}
 *
 * **NOTE** Because the length is implicit in the size of the buffer
 * this layout should be used only in isolation, or in a situation
 * where the length can be expressed by operating on a slice of the
 * containing buffer.
 *
 * @param {Number} [maxSpan] - the maximum length allowed for encoded
 * string content.  If not provided there is no bound on the allowed
 * content.
 *
 * @param {String} [property] - initializer for {@link
    * Layout#property|property}.
 *
 * @augments {Layout}
 */
export class UTF8 extends Layout<string> {
    maxSpan: number;
    constructor(maxSpan?: number | string, property?: string) {
        if (('string' === typeof maxSpan) && (undefined === property)) {
            property = maxSpan;
            maxSpan = undefined;
        }
        if (undefined === maxSpan) {
            maxSpan = -1;
        } else if (!Number.isInteger(maxSpan)) {
            throw new TypeError('maxSpan must be an integer');
        }

        super(-1, property);

        /** The maximum span of the layout in bytes.
         *
         * Positive values are generally expected.  Zero is abnormal.
         * Attempts to encode or decode a value that exceeds this length
         * will throw a `RangeError`.
         *
         * A negative value indicates that there is no bound on the length
         * of the content. */
        this.maxSpan = maxSpan as number;
    }

    /** @override */
    getSpan(b: Uint8Array, offset = 0): number {
        checkUint8Array(b);
        return b.length - offset;
    }

    /** @override */
    decode(b: Uint8Array, offset = 0): string {
        const span = this.getSpan(b, offset);
        if ((0 <= this.maxSpan)
            && (this.maxSpan < span)) {
            throw new RangeError('text length exceeds maxSpan');
        }
        return uint8ArrayToBuffer(b).slice(offset, offset + span).toString('utf-8');
    }

    /** @override */
    encode(src: string | LayoutObject, b: Uint8Array, offset = 0): number {
        /* Must force this to a string, lest it be a number and the
         * "utf8-encoding" below actually allocate a buffer of length
         * src */
        if ('string' !== typeof src) {
            src = String(src);
        }
        const srcb = Buffer.from(src, 'utf8');
        const span = srcb.length;
        if ((0 <= this.maxSpan)
            && (this.maxSpan < span)) {
            throw new RangeError('text length exceeds maxSpan');
        }
        if ((offset + span) > b.length) {
            throw new RangeError('encoding overruns Buffer');
        }
        srcb.copy(uint8ArrayToBuffer(b), offset);
        return span;
    }
}

/**
 * Contain a constant value.
 *
 * This layout may be used in cases where a JavaScript value can be
 * inferred without an expression in the binary encoding.  An example
 * would be a {@link VariantLayout|variant layout} where the content
 * is implied by the union {@link Union#discriminator|discriminator}.
 *
 * @param {Object|Number|String} value - initializer for {@link
    * Constant#value|value}.  If the value is an object (or array) and
 * the application intends the object to remain unchanged regardless
 * of what is done to values decoded by this layout, the value should
 * be frozen prior passing it to this constructor.
 *
 * @param {String} [property] - initializer for {@link
    * Layout#property|property}.
 *
 * @augments {Layout}
 */
export class Constant<T> extends Layout<T> {
    value: T;
    constructor(value: T, property?: string) {
        super(0, property);

        /** The value produced by this constant when the layout is {@link
            * Constant#decode|decoded}.
         *
         * Any JavaScript value including `null` and `undefined` is
         * permitted.
         *
         * **WARNING** If `value` passed in the constructor was not
         * frozen, it is possible for users of decoded values to change
         * the content of the value. */
        this.value = value;
    }

    /** @override */
    decode(b?: Uint8Array, offset?: number): T {
        return this.value;
    }

    /** @override */
    encode(src: T, b?: Uint8Array, offset?: number): number {
        /* Constants take no space */
        return 0;
    }
}

/** Factory for {@link GreedyCount}. */
export const greedy = ((elementSpan: number, property?: string): GreedyCount => new GreedyCount(elementSpan, property));

/** Factory for {@link OffsetLayout}. */
export const offset = ((layout: Layout<number>, offset?: number, property?: string): OffsetLayout =>
    new OffsetLayout(layout, offset, property));

/** Factory for {@link UInt|unsigned int layouts} spanning one
 * byte. */
export const u8 = ((property?: string): UInt => new UInt(1, property));

/** Factory for {@link UInt|little-endian unsigned int layouts}
 * spanning two bytes. */
export const u16 = ((property?: string): UInt => new UInt(2, property));

/** Factory for {@link UInt|little-endian unsigned int layouts}
 * spanning three bytes. */
export const u24 = ((property?: string): UInt => new UInt(3, property));

/** Factory for {@link UInt|little-endian unsigned int layouts}
 * spanning four bytes. */
export const u32 = ((property?: string): UInt => new UInt(4, property));

/** Factory for {@link UInt|little-endian unsigned int layouts}
 * spanning five bytes. */
export const u40 = ((property?: string): UInt => new UInt(5, property));

/** Factory for {@link UInt|little-endian unsigned int layouts}
 * spanning six bytes. */
export const u48 = ((property?: string): UInt => new UInt(6, property));

/** Factory for {@link NearUInt64|little-endian unsigned int
 * layouts} interpreted as Numbers. */
export const nu64 = ((property?: string): NearUInt64 => new NearUInt64(property));

/** Factory for {@link UInt|big-endian unsigned int layouts}
 * spanning two bytes. */
export const u16be = ((property?: string): UIntBE => new UIntBE(2, property));

/** Factory for {@link UInt|big-endian unsigned int layouts}
 * spanning three bytes. */
export const u24be = ((property?: string): UIntBE => new UIntBE(3, property));

/** Factory for {@link UInt|big-endian unsigned int layouts}
 * spanning four bytes. */
export const u32be = ((property?: string): UIntBE => new UIntBE(4, property));

/** Factory for {@link UInt|big-endian unsigned int layouts}
 * spanning five bytes. */
export const u40be = ((property?: string): UIntBE => new UIntBE(5, property));

/** Factory for {@link UInt|big-endian unsigned int layouts}
 * spanning six bytes. */
export const u48be = ((property?: string): UIntBE => new UIntBE(6, property));

/** Factory for {@link NearUInt64BE|big-endian unsigned int
 * layouts} interpreted as Numbers. */
export const nu64be = ((property?: string): NearUInt64BE => new NearUInt64BE(property));

/** Factory for {@link Int|signed int layouts} spanning one
 * byte. */
export const s8 = ((property?: string): Int => new Int(1, property));

/** Factory for {@link Int|little-endian signed int layouts}
 * spanning two bytes. */
export const s16 = ((property?: string): Int => new Int(2, property));

/** Factory for {@link Int|little-endian signed int layouts}
 * spanning three bytes. */
export const s24 = ((property?: string): Int => new Int(3, property));

/** Factory for {@link Int|little-endian signed int layouts}
 * spanning four bytes. */
export const s32 = ((property?: string): Int => new Int(4, property));

/** Factory for {@link Int|little-endian signed int layouts}
 * spanning five bytes. */
export const s40 = ((property?: string): Int => new Int(5, property));

/** Factory for {@link Int|little-endian signed int layouts}
 * spanning six bytes. */
export const s48 = ((property?: string): Int => new Int(6, property));

/** Factory for {@link NearInt64|little-endian signed int layouts}
 * interpreted as Numbers. */
export const ns64 = ((property?: string): NearInt64 => new NearInt64(property));

/** Factory for {@link Int|big-endian signed int layouts}
 * spanning two bytes. */
export const s16be = ((property?: string): IntBE => new IntBE(2, property));

/** Factory for {@link Int|big-endian signed int layouts}
 * spanning three bytes. */
export const s24be = ((property?: string): IntBE => new IntBE(3, property));

/** Factory for {@link Int|big-endian signed int layouts}
 * spanning four bytes. */
export const s32be = ((property?: string): IntBE => new IntBE(4, property));

/** Factory for {@link Int|big-endian signed int layouts}
 * spanning five bytes. */
export const s40be = ((property?: string): IntBE => new IntBE(5, property));

/** Factory for {@link Int|big-endian signed int layouts}
 * spanning six bytes. */
export const s48be = ((property?: string): IntBE => new IntBE(6, property));

/** Factory for {@link NearInt64BE|big-endian signed int layouts}
 * interpreted as Numbers. */
export const ns64be = ((property?: string): NearInt64BE => new NearInt64BE(property));

/** Factory for {@link Float|little-endian 32-bit floating point} values. */
export const f32 = ((property?: string): Float => new Float(property));

/** Factory for {@link FloatBE|big-endian 32-bit floating point} values. */
export const f32be = ((property?: string): FloatBE => new FloatBE(property));

/** Factory for {@link Double|little-endian 64-bit floating point} values. */
export const f64 = ((property?: string): Double => new Double(property));

/** Factory for {@link DoubleBE|big-endian 64-bit floating point} values. */
export const f64be = ((property?: string): DoubleBE => new DoubleBE(property));

/** Factory for {@link Structure} values. */
export const struct = (<T>(fields: Layout<T[keyof T]>[], property?: string, decodePrefixes?: boolean): Structure<T> =>
    new Structure<T>(fields, property, decodePrefixes));

/** Factory for {@link BitStructure} values. */
export const bits = ((word: UInt | UIntBE, msb: boolean | string, property?: string): BitStructure =>
    new BitStructure(word, msb, property));

/** Factory for {@link Sequence} values. */
export const seq = (<T>(elementLayout: Layout<T>, count: number | ExternalLayout, property?: string): Sequence<T> =>
    new Sequence<T>(elementLayout, count, property));

/** Factory for {@link Union} values. */
export const union = ((discr: Layout<LayoutObject> | UnionDiscriminator,
                       defaultLayout: Layout<LayoutObject> | null, property: string): Union =>
    new Union(discr, defaultLayout, property));

/** Factory for {@link UnionLayoutDiscriminator} values. */
export const unionLayoutDiscriminator = ((layout: ExternalLayout, property: string): UnionLayoutDiscriminator =>
    new UnionLayoutDiscriminator(layout, property));

/** Factory for {@link Blob} values. */
export const blob = ((length: number | ExternalLayout, property?: string): Blob => new Blob(length, property));

/** Factory for {@link CString} values. */
export const cstr = ((property?: string): CString => new CString(property));

/** Factory for {@link UTF8} values. */
export const utf8 = ((maxSpan: number, property?: string): UTF8 => new UTF8(maxSpan, property));

/** Factory for {@link Constant} values. */
export const constant = (<T>(value: T, property?: string): Constant<T> => new Constant(value, property));
