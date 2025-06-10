
import map1 from "./table/map1.js";
import map2 from "./table/map2.js";

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
		return null;
	}

}

function getCodePoint(plane, row, cell) {

	let info = map2.get(getPRCValue(plane, row, cell));

	if (info) {
		return [...info[0]];
	} else {
		return null;
	}
}

function getLevel(plane, row, cell) {

	let info = map2.get(getPRCValue(plane, row, cell));

	if (info) {
		return info[1];
	} else {
		return NaN;
	}
}

function getProperties(plane, row, cell) {

	let info = map2.get(getPRCValue(plane, row, cell));

	if (info) {
		return new KanjiInfo(...info);
	} else {
		return null;
	}
}



class KanjiInfo {

	constructor(codePoints, level, x0208, joyo, jinmei) {

		this.codePoints = [...codePoints];
		this.level = level;
		this.x0208 = Boolean(x0208);
		this.joyo = Boolean(joyo);
		this.jinmei = Boolean(jinmei);
	}
}

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
