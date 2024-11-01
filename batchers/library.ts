const defaultOptions = {
	startSymbol: "|",
	seperator: "|",
	endSymbol: "|",
};
function lineBuilder(data, options = defaultOptions) {
	const array = [options.startSymbol];
	const dataLength = data.length;
	for (let i = 0; i < dataLength; i++) {
		array.push(stringBuilder(...data[i]));
		if (i < dataLength - 1) array.push(options.seperator);
	}
	array.push(options.endSymbol);
	return array.join("");
}
function stringBuilder(string, length) {
	const startPad = Math.floor((length - string.length) / 2);
	return string.padStart(startPad).padEnd(length);
}
