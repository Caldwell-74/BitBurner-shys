

function rowBuilder(data) {
    const startSymbol = "|"
    const seperator = "|"
    const endSymbol = "|"

    const array = [startSymbol];
    for (const [string, length] of data) {
        const startPad = Math.floor((length - string.length) / 2);
        array.push(string.padStart(startPad).padEnd(length), seperator);
    }

    return array.join("");
}

function buildTable(ns) {
    const totalLength = 50;
    const rows = ["server", "difficulty"]
    const rowLengths = [40, 10]
    const output = ["-".repeat(totalLength)]
    output.push(rows.map((r, i) => [r, rowLengths[i]]))
    const serverData = getAllServer(ns).map(server => [server, ns.getServerMinSecurity(server)])
    for (const rowData of serverData) {
        const data = rowLengths.map((length, i) => [serverD[i], length])
        output.push(rowBuilder(data))
    }
    output.push("-".repeat(totalLength))
    return output.join("\n")
}