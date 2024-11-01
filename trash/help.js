/** @param {NS} ns **/
export async function main(ns) {
    const hosts = getAllServer(ns);
    const rhosts = hosts.filter(ns.hasRootAccess)
    const data = {
        hack: ns.getScriptRam("/newserver/hack.js"),
        grow: ns.getScriptRam("/newserver/grow.js"),
        weaken: ns.getScriptRam("/newserver/weaken.js"),
        serverRam: ns.args[0]
    }
    const orderedHosts = rhosts.map(server => ({ server, ...getBatchData(ns, server, data) })).sort((a, b) => b.score - a.score)
    ns.tprint(orderedHosts[0])
}
/** @param {NS} ns **/
function getBatchData(ns, serverName, data) {
    const hackPercent = 0.05
    const weakenPower = ns.weakenAnalyze(1)
    const f = ns.formulas.hacking;
    const server = ns.getServer(serverName);
    const player = ns.getPlayer()
    fserver.hackDifficulty = fserver.minDifficulty;
    fserver.moneyAvailable = fserver.moneyMax * hackPercent
    const hackThreads = Math.floor(hackPercent / f.hackPercent(server, player))
    const hackWeakenThreads = Math.ceil(hackThreads * 0.002 / weakenPower)
    const growThreads = f.growThreads(server, player, server.moneyMax)
    const growWeakenThreads = Math.ceil(growThreads * 0.002 * 2 / weakenPower)
    const hacktime = f.hackTime(server, player)
    const totalRamForRun = hackThreads * data.hack + growThreads * data.growThreads + (hackWeakenThreads + growWeakenThreads) * data.weaken;
    const batches = Math.floor(data.serverRam / totalRamForRun)
    return {
        hackThreads,
        growThreads,
        hackWeakenThreads,
        growWeakenThreads,
        hacktime,
        score: (fserver.moneyMax * hackPercent * hackThreads * batches) / hacktime
    }
}
function getAllServer(ns) {
    const allServer = ["home"]
    for (const server of allServer) {
        for (const found of ns.scan(server)) {
            if (!allServer.includes(found)) allServer.push(found)
        }
    }
    return allServer
}