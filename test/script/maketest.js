import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";


const dir = path.join(".", "test", "script");

/* テスト本体部分 */
const main = await fs.readFile(path.join(dir, "test-main.js"));


/*  [ [出力テストスクリプトファイル名, import部分ファイル名], ... ]  */
const tests = [["test-mjs.js", "test-header.js"], ["test-cjs.cjs", "test-header.cjs"], ["test-src.js", "test-header-src.js"]];


/* テストスクリプト作成 */
await Promise.all(tests.map(async filename=>{

	const data = Buffer.concat([await fs.readFile(path.join(dir, filename[1])), main]);
	return fs.writeFile(path.join(dir, "../", filename[0]), data);
}));

