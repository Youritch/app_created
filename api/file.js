const {readFile, stat, writeFile, mkdir, appendFile} = require("fs/promises");
const {join, relative} = require("path");

/**
 * @param {string} path - the path of the file to read
 */
module.exports.readFile = async (path) => {
	if (!(await this.existFile(path))) return false;
	try {
		return await readFile(join(__dirname, relative(__dirname, path)), "utf8");
	} catch (err) {
		console.log(err);
		return false;
	}
};

/**
 * @param {string} path - the path of the file to check
 */
module.exports.existFile = async (path) => {
	try {
		return !!(await stat(join(__dirname, relative(__dirname, path))));
	} catch (err) {
		//console.log(err);//sinon log des truc quand file exist pas
		return false;
	}
};

/**
 * @param {string} path - the path of the file to write in
 * @param {string | NodeJS.ArrayBufferView | Iterable<string | NodeJS.ArrayBufferView> | AsyncIterable<string | NodeJS.ArrayBufferView>} text - the text to write in the file
 * @param {boolean} overwrite - if the text overwrite the file
 */
module.exports.writeFile = async (path, text, overwrite = false) => {
	try {
		if (!overwrite && await this.existFile(path)) {
			return await appendFile(join(__dirname, relative(__dirname, path)), text, "utf8");
		}
		return await writeFile(join(__dirname, relative(__dirname, path)), text.toString(), "utf8");
	} catch (err) {
		console.log(err);
		return false;
	}
};

/**
 * @param {string} path - the path of the dir
 * @param {string} name - name of the dir
 */
module.exports.createDir = async (path, name) => {
	try {
		return await mkdir(join(__dirname, relative(__dirname, path + "/" + name)));
	} catch (err) {
		console.log(err);
		return false;
	}
};