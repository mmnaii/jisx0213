/**
 * @module
 */

/** @const {Map.<number, number>} map1 */
import map1 from "./table/map1.js";
/** @const {Map.<number, Array.<number|number[]>>} map2 */
import map2 from "./table/map2.js";

/**
 * Takes Unicode code points and returns a plane-row-cell.
 * @param {number[]} codePoints - A sequence of Unicode code points.
 * @return {?number[]} A plane-row-cell.
 */
function getPRC(...codePoints) {

	/* 引数から符号位置値を取得 */
	let value = 0;

	for (let i=0; i<2 && i<codePoints.length; i++) {
		let cp = Number(codePoints[i]);

		if (0 < cp && cp <= 0x10FFFF) {
			value += cp * (0x1000000 ** i); 
		} else {
			/* 無効な符号位置値が指定された場合 */
			return null;
		}
	}

	/* 対応する面区点位置を取得 */
	let prcValue = map1.get(value);

	if (prcValue) {

		let prc = [];
		for (let i=0; i<3; i++, prcValue >>>= 8) {
			prc.push(prcValue & 0xff);
		}

		return prc;
	} else {
		/* 対応する面区点位置が存在しない */
		return null;
	}

}

/**
 * Takes a plane-row-cell and returns a sequence of Unicode code points.
 * @param {number} plane
 * @param {number} row
 * @param {number} cell
 * @return {?number[]} A sequence of Unicode code points
 */
function getCodePoint(plane, row, cell) {

	let info = map2.get(getPRCValue(plane, row, cell));

	if (info) {
		return [...info[0]];
	} else {
		/* その面区点位置に文字が割り当てられていない */
		return null;
	}
}

/**
 * Takes a plane-row-cell and returns a kanji level.
 * @param {number} plane
 * @param {number} row
 * @param {number} cell
 * @return {number} A kanji level
 */
function getLevel(plane, row, cell) {

	let info = map2.get(getPRCValue(plane, row, cell));

	if (info) {
		return info[1];
	} else {
		/* その面区点位置に文字が割り当てられていない */
		return NaN;
	}
}

/**
 * Takes a plane-row-cell and returns character's information about the JIS X 0213.
 * @param {number} plane
 * @param {number} row
 * @param {number} cell
 * @return {?KanjiInfo} An object containing attributes about a character
 */
function getProperties(plane, row, cell) {

	let info = map2.get(getPRCValue(plane, row, cell));

	if (info) {
		return new KanjiInfo(...info);
	} else {
		/* その面区点位置に文字が割り当てられていない */
		return null;
	}
}


/** @class Provides character's attributes about JIS X 0213 character set as object properties. */
class KanjiInfo {

	/**
	 * @hideconstructor
	 * @param {number[]} codePoints
	 * @param {number} level
	 * @param {number} x0208
	 * @param {number} joyo
	 * @param {number} jinmei
	 */
	constructor(codePoints, level, x0208, joyo, jinmei) {

		/** @member {number[]} */
		this.codePoints = [...codePoints];
		/** @member {number} */
		this.level = level;
		/** @member {boolean} */
		this.x0208 = Boolean(x0208);
		/** @member {boolean} */
		this.joyo = Boolean(joyo);
		/** @member {boolean} */
		this.jinmei = Boolean(jinmei);
	}
}


/**
 * @param {number} plane
 * @param {number} row
 * @param {number} cell
 * @return {number} A value representing a plane-row-cell
 */
function getPRCValue(plane, row, cell) {

	return [Number(plane), Number(row), Number(cell)].reduce((prev, cur, index)=>{
		return prev + (cur << (8 * index));
	}, 0);
}



const Jisx0213 = {
	getPRC,
	getCodePoint,
	getLevel,
	getProperties
};

export {Jisx0213 as default, getPRC, getCodePoint, getLevel, getProperties};
