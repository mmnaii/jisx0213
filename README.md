# jisx0213

## Description

jisx0213 provides methods to execute conversions between JIS X 0213 plane-row-cells and Unicode code points and to get characters information about the JIS X 0213 character set.

## Examples

* To get the plane-row-cell of a character.

```javascript
import {getPRC} from '@mmnaii/jisx0213';

// {2-94-4} : "鴂" U+9D02
getPRC( 0x9D02 ); // [ 2, 94, 4 ]

// {1-11-36} : "æ̀" U+00E6 U+0300
getPRC( 0x00E6, 0x0300 ); // [ 1, 11, 36 ]
```

* To get the Unicode code point of a character.

```javascript
import {getCodePoint} from '@mmnaii/jisx0213';

// {2-94-4} : "鴂" U+9D02
getCodePoint( 2, 94, 4 ); // [ 40194 ] ( [ 0x9d02 ] )

// {1-11-36} : "æ̀" U+00E6 U+0300
getCodePoint( 1, 11, 36 ); // [ 230, 768 ] ( [ 0xe6, 0x300 ] )
```

* To get the kanji level of a character.

```javascript
import {getLevel} from '@mmnaii/jisx0213';

// {2-94-4} : "鴂"
getLevel( 2, 94, 4 ); // 4

// {1-4-2} : "あ" (not a kanji)
getLevel( 1, 4, 2 ); // 0 
```

* To get information about a character.

```javascript
import {getProperties} from '@mmnaii/jisx0213';

// {1-37-84} : "灯" U+706F (28783)
getProperties( 1, 37, 84 ); //
// KanjiInfo {
//   codePoints: [ 28783 ],
//   level: 1,
//   x0208: true,
//   joyo: true,
//   jinmei: false
// }

// {1-86-35} : "步" U+6B65 (27493)
getProperties( 1, 86, 35 ); //
// KanjiInfo {
//   codePoints: [ 27493 ],
//   level: 3,
//   x0208: false,
//   joyo: false,
//   jinmei: true
// }
```


## Mapping

To convert code points, this library uses a mapping table. The table has a one-to-one correspondence between plane-row-cells and sequences of Unicode code points, and the mapping is followed to what is defined by the JIS X 0213 specification edition 2004.

For example, the plane-row-cell `{1-3-33}` (`"A"`) is mapped to the Unicode code point`U+0041` (LATIN CAPITAL LETTER A), not to `U+FF21` (`"Ａ"` : FULLWIDTH LATIN CAPITAL LETTER A). And `U+FF21` is not mapped to any plane-row-cells.

```javascript
getCodePoint( 1, 3, 33 ); // [ 65 ] ( [ 0x41 ] )
getPRC( 0x41 ); // [ 1, 3, 33 ]
getPRC( 0xFF21 ); // null
```


## API

### jisx0213.getPRC(...codePoints)

* `codePoints` \<number[]> sequence of Unicode code points
* Returns: \<number[]> | \<null> plane-row-cell

Takes a sequence of Unicode code points and returns a plane-row-cell.

This method takes one or two arguments which form a sequence of Unicode code points. The third and later arguments are ignored. The elements of the returned array are a plane, a row and a cell in order, which represents a plane-row-cell corresponding to the given sequence of Unicode code points. Null is returned if the given sequence of Unicode code points doesn't correspond to any plane-row-cells or either of the arguments is invalid Unicode code point.

### jisx0213.getCodePoint(plane, row, cell)

* plane \<number> 
* row \<number> 
* cell \<number> 
* Returns: \<number[]> | \<null>  sequence of Unicode code points

Takes a plane-row-cell and returns a sequence of Unicode code points.

This method takes 3 arguments those are a plane, a row and a cell and returns an array whose elements form a sequence of Unicode code points corresponding to the given plane-row-cell. Null is returned if no character is assigned to the given plane-row-cell.

### jisx0213.getLevel(plane, row, cell)

* plane \<number> 
* row \<number> 
* cell \<number> 
* Returns: \<number> kanji level

Takes a plane-row-cell and returns a kanji level.

This method takes 3 arguments those are a plane, a row and a cell and returns the kanji level of the character represented by the given plane-row-cell. It returns 0 if the character assigned to the given plane-row-cell is not a kanji and returns NaN if no character is assigned to.

### jisx0213.getProperties(plane, row, cell)

* plane \<number> 
* row \<number> 
* cell \<number> 
* Returns: \<jisx0213.KanjiInfo>

Takes a plane-row-cell and returns character's information about the JIS X 0213.

This method takes 3 arguments those are a plane, a row and a cell and returns a <jisx0213.KanjiInfo> object which contains a set of properties of the character represented by the given plane-row-cell. It returns null if no character is assigned to the given plane-row-cell.


### Class: jisx0213.KanjiInfo

Provides character's attributes about the JIS X 0213 character set as object properties.

#### kanjiInfo.codePoints

* \<number[]>

A sequence of Unicode code points representing a character. The length of the sequence is 1 or 2 and each element is a valid Unicode code point value.

#### kanjiInfo.level

* \<number>

A kanji level of a character. It is 0 if the character is not a kanji.

#### kanjiinfo.x0208

* \<boolean>

It is true if the character belongs to the JIS X 0208 character set.

#### kanjiinfo.joyo

* \<boolean>

It is true if the character is a joyo kanji.

#### kanjiinfo.jinmei

* \<boolean>

It is true if the character is a jinmei-yo kanji.

