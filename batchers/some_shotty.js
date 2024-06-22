/** @param {NS} ns **/
export async function main(ns) {
    const scriptCap = 400000
    const targetServer = ns.args[0];
    const allServers = getAllServers(ns);
    allServers.forEach(server => ns.scp(["delayedHack.js", "delayedWeaken.js", "delayedGrow.js", "complexDeploy.js"], server))

    // Main attack loop
    while (true) {
        let totalScripts = 0;
        while (stopFlag && totalScripts < scriptCap) {
            // Calculate times and threads for operations
            const { hack, weakenHack, grow, weakenGrow } = getData(ns, targetServer)
            const nextSleep = performance.now() + 400
            while (performance.now() < nextSleep && totalScripts < scriptCap) {
                // Deploy operations in synchronized order
                const hackPid = ns.exec('delayedHack.js', findRam(ns, allServers, hack.ram), hack.threads, targetServer, hack.delay);
                const weakenHackPid = ns.exec('delayedWeaken.js', findRam(ns, allServers, weakenHack.ram), weakenHack.threads, targetServer, weakenHack.delay);
                const growPid = ns.exec('delayedGrow.js', findRam(ns, allServers, grow.ram), grow.threads, targetServer, grow.delay);
                const weakenGrowPid = ns.exec('delayedWeaken.js', findRam(ns, allServers, weakenGrow.ram), weakenGrow.threads, targetServer, weakenGrow.delay);
                if (!hackPid || !weakenHackPid || !growPid || !weakenGrowPid) {
                    stopFlag = false
                    ns.kill(hackPid)
                    ns.kill(weakenHackPid)
                    ns.kill(growPid)
                    ns.kill(weakenGrowPid)
                    break
                } else {
                    totalScripts += 4
                }
            }
            await ns.sleep(0)
        }
        await ns.sleep(ns.getWeakenTime(targetServer));
    }
}
function getData(ns, target) {
    const hackPercentage = 0.05; //Todo: figure out what the best percentage is
    const weakenStrength = ns.weakenAnalyze(1)

    const hackThreads = Math.floor(hackPercentage / ns.hackAnalyze(target));
    const growThreads = Math.ceil(ns.growthAnalyze(target, 1 / (1 - hackPercentage)) * 1.1); //10% more to account for weirdness
    const weakenHackThreads = Math.ceil(hackThreads * 0.002 / weakenStrength);
    const weakenGrowThreads = Math.ceil(growThreads * 0.004 / weakenStrength);

    const hackRam = hackThreads * 1.7
    const weakenHackRam = weakenHackThreads * 1.75
    const growRam = growThreads * 1.75
    const weakenGrowRam = weakenGrowThreads * 1.75

    const hackTime = ns.getHackTime(targetServer);
    const hackDelay = hackTime * 3;
    const growDelay = hackTime * 0.8;

    return {
        hack: {
            threads: hackThreads,
            ram: hackRam,
            delay: hackDelay
        },
        weakenHack: {
            threads: weakenHackThreads,
            ram: weakenHackRam,
            delay: 0
        },
        grow: {
            threads: growThreads,
            ram: growRam,
            delay: growDelay
        },
        weakenGrowRam: {
            threads: weakenGrowThreads,
            ram: weakenGrowRam,
            delay: 0
        }
    }
}
function findRam(ns, ram, servers) {
    return servers.find(server => availableRam(ns, server) >= ram) ?? "n00dles"
}
function availableRam(ns, server) {
    return ns.getServerMaxRam(server) - ns.getServerUsedRam(server)
}
function getAllServers(ns) {
    const serversFound = ["home"];
    for (const server of serversFound)
        for (const found of ns.scan(server))
            if (!serversFound.includes(found)) serversFound.push(found)
    return serversFound;
}
