

/*
名前付きエクスポート:   {getPRC, getCodePoint, getLevel, getProperties}
デフォルトエクスポート: Jisx0213
*/


/* テストデータの準備 */
let testdata = []; /* 0: 面区点位置, 1: ユニコード符号位置, 2: 漢字水準, 3: JIS X0208, 4: 常用漢字, 5: 人名用漢字 */

(fs.readFileSync("./test/resource/testdata.csv")).toString().split("\r\n").forEach(line=>{

	let fields = line.split(",");
	fields.length === 6 && testdata.push(fields.map((field, index)=>{
		if (index === 0) {
			return field.split("-").map(prc=>parseInt(prc, 10));
		} else if (index === 1) {
			return field.split(" ").map(cp=>parseInt(cp.replace("U+", "0x"), 16));
		} else if (index === 2) {
			return parseInt(field, 10);
		} else {
			return Boolean(field);
		}
	}));

});

const unassignedPRC = [[1, 8, 63], [1, 8, 94], [1, 12, 92], [1, 13, 56], [2, 2, 1], [2, 94, 94]]; /* 文字が割り当てられていない面区点位置 */
const notPRC = [[0, 0, 0], [0, 1, 1], [3, 1, 1], [1, 94, 95], [1, 1]]; /* 不正な面区点位置 */
const unassignedCodePoints = [[0], [0xFF0C], [0xFF21], [0xFFE6], [0x2A6B3], [0x10FFFF], [0x3000, 0x3001], [0, 0x3000], [0x3000, 0]]; /* 面区点位置が割り当てられていない符号位置 */
const notUnicodeCodePoints = [[-1], [0x110000], [NaN], [0x3000, 0x110000]]; /* 有効なユニコード符号位置の並びではない */

/* デフォルトエクスポートの確認 */
test("default exports", async t=>{

	t.assert.deepStrictEqual(Jisx0213.getPRC, getPRC, "getPRC");
	t.assert.deepStrictEqual(Jisx0213.getCodePoint, getCodePoint, "getCodePoint");
	t.assert.deepStrictEqual(Jisx0213.getLevel, getLevel, "getLevel");
	t.assert.deepStrictEqual(Jisx0213.getProperties, getProperties, "getProperties");
});


/* 各メソッドのテスト */
test("getPRC", async t=>{

	await t.test("assigned code-points", t=>{
		testdata.forEach(data=>{
			t.assert.deepStrictEqual(getPRC(...data[1]), data[0], data[1].map(v=>`0x${v.toString(16)}`));
		});
	});

	await t.test("unassigned code-points", t=>{
		unassignedCodePoints.forEach(data=>{
			t.assert.deepStrictEqual(getPRC(...data), null, data.map(v=>`0x${v.toString(16)}`));
		});
	});

	await t.test("not unicode code-points", t=>{
		notUnicodeCodePoints.forEach(data=>{
			t.assert.deepStrictEqual(getPRC(...data), null, data.map(v=>`0x${v.toString(16)}`));
		});
	});
});


test("getCodePoint", async t=>{

	await t.test("assigned plane-row-cell", t=>{
		testdata.forEach(data=>{
			t.assert.deepStrictEqual(getCodePoint(...data[0]), data[1], data[0]);
		});
	});

	await t.test("unassigned plane-row-cell", t=>{
		unassignedPRC.forEach(data=>{
			t.assert.deepStrictEqual(getCodePoint(...data), null, data);
		});
	});

	await t.test("not plain-row-cell", t=>{
		notPRC.forEach(data=>{
			t.assert.deepStrictEqual(getCodePoint(...data), null, data);
		});
	});
});

test("getLevel", async t=>{

	await t.test("assigned plane-row-cell", t=>{
		testdata.forEach(data=>{
			t.assert.deepStrictEqual(getLevel(...data[0]), data[2], data[0]);
		});
	});

	await t.test("unassigned plane-row-cell", t=>{
		unassignedPRC.forEach(data=>{
			t.assert.deepStrictEqual(getLevel(...data), NaN, data);
		});
	});

	await t.test("not plain-row-cell", t=>{
		notPRC.forEach(data=>{
			t.assert.deepStrictEqual(getLevel(...data), NaN, data);
		});
	});
});

test("getProperties", async t=>{

	await t.test("assigned plane-row-cell", t=>{
		testdata.forEach(data=>{
			const r = getProperties(...data[0]);
			t.assert.deepStrictEqual(r?.codePoints, data[1], data[0]);
			t.assert.deepStrictEqual(r?.level, data[2], data[0]);
			t.assert.deepStrictEqual(r?.x0208, data[3], data[0]);
			t.assert.deepStrictEqual(r?.joyo, data[4], data[0]);
			t.assert.deepStrictEqual(r?.jinmei, data[5], data[0]);
		});
	});

	await t.test("unassigned plane-row-cell", t=>{
		unassignedPRC.forEach(data=>{
			t.assert.deepStrictEqual(getProperties(...data), null, data);
		});
	});

	await t.test("not plain-row-cell", t=>{
		notPRC.forEach(data=>{
			t.assert.deepStrictEqual(getProperties(...data), null, data);
		});
	});

});

