import { defaultButtonStyle, titleButtonContainer } from "button.js";



let investableMoney = 0;

// buttons 
const menuButton = React.createElement("button",
    { className: "buttonStyle", onClick: () => menuButtonOnClick(ns) },
    "Menu"
);

/** @param {NS} ns */
export async function main(ns) {
    ns.tail();
    ns.setTitle(titleButtonContainer(defaultButtonStyle, "nodeManager.js", menuButton));
    //ns.setTitle(buttonContainer(nodeManagerButton));
    ns.disableLog("ALL");
    while (true) {
        ns.print(ns.formatNumber(investableMoney));
        await upgradeNode(ns, bestNodeToUpgrade(ns));

    }

}

function menuButtonOnClick(ns) {
    ns.print("hiii");
}

export async function updateMoney(ns) {
    investableMoney = investableMoney + nodeMoneyPerSecond(ns);
    ns.print(ns.formatNumber(investableMoney));
    await ns.sleep(1000);
}

export async function upgradeNode(ns, node) {
    const mostProfitable = Math.min(ns.hacknet.getLevelUpgradeCost(node) / levelUpgradeProfit(ns, node),
        ns.hacknet.getRamUpgradeCost(node) / ramUpgradeProfit(ns, node),
        ns.hacknet.getCoreUpgradeCost(node) / coreUpgradeProfit(ns, node));
    if (ns.hacknet.getLevelUpgradeCost(node) / levelUpgradeProfit(ns, node) == mostProfitable) {
        while (investableMoney < ns.hacknet.getLevelUpgradeCost(node)) {
            await updateMoney(ns);
            ns.print("ERROR ", "no money for level on #" + node + " ):");
        }
        investableMoney = investableMoney - ns.hacknet.getLevelUpgradeCost(node);
        ns.hacknet.upgradeLevel(node);
        ns.print("SUCCESS ", "BOUGHT LVL FOR #" + node + " :DDDD");
    }
    else if (ns.hacknet.getRamUpgradeCost(node) / ramUpgradeProfit(ns, node) == mostProfitable) {
        while (investableMoney < ns.hacknet.getRamUpgradeCost(node)) {
            await updateMoney(ns);
            ns.print("ERROR ", "no money for ram on #" + node + " ):");
        }
        investableMoney = investableMoney - ns.hacknet.getRamUpgradeCost(node);
        ns.hacknet.upgradeRam(node);
        ns.print("SUCCESS ", "BOUGHT RAM FOR #" + node + " :DDDD");
    }
    else if (ns.hacknet.getCoreUpgradeCost(node) / coreUpgradeProfit(ns, node) == mostProfitable) {
        while (investableMoney < ns.hacknet.getCoreUpgradeCost(node)) {
            await updateMoney(ns);
            ns.print("ERROR ", "no money for core on #" + node + " ):");
        }
        investableMoney = investableMoney - ns.hacknet.getCoreUpgradeCost(node);
        ns.hacknet.upgradeCore(node);
        ns.print("SUCCESS ", "BOUGHT CORE FOR #" + node + " :DDDD");
    }
}

export function bestNodeToUpgrade(ns) {
    let bestNodeUpgrades = new Array;

    for (let i = 0; i < ns.hacknet.numNodes(); i++) {
        bestNodeUpgrades.push(Math.min(ns.hacknet.getLevelUpgradeCost(i) / levelUpgradeProfit(ns, i),
            ns.hacknet.getRamUpgradeCost(i) / ramUpgradeProfit(ns, i),
            ns.hacknet.getCoreUpgradeCost(i) / coreUpgradeProfit(ns, i)));
        // ns.tprint("INFO ", "#" + i);
        // ns.tprint(ns.hacknet.getLevelUpgradeCost(i) / levelUpgradeProfit(ns, i));
        // ns.tprint(ns.hacknet.getRamUpgradeCost(i) / ramUpgradeProfit(ns, i));
        // ns.tprint(ns.hacknet.getCoreUpgradeCost(i) / coreUpgradeProfit(ns, i));
    }
    return bestNodeUpgrades.indexOf(Math.min(...bestNodeUpgrades));
}


export function nodeMoneyPerSecond(ns) {
    let result = 0;
    for (let i = 0; i < ns.hacknet.numNodes(); i++) {
        result = result + ns.hacknet.getNodeStats(i).production;
    }
    return result;
}

export function levelUpgradeProfit(ns, node) {
    const nodeInfo = ns.hacknet.getNodeStats(node);

    if (nodeInfo.level >= 200) return 9999999;
    else {
        return ns.formulas.hacknetNodes.moneyGainRate(nodeInfo.level + 1, nodeInfo.ram, nodeInfo.cores, ns.getPlayer().mults.hacknet_node_money)
            - ns.formulas.hacknetNodes.moneyGainRate(nodeInfo.level, nodeInfo.ram, nodeInfo.cores, ns.getPlayer().mults.hacknet_node_money);
    }
}

export function ramUpgradeProfit(ns, node) {
    const nodeInfo = ns.hacknet.getNodeStats(node);

    if (nodeInfo.ram >= 64) return 9999999;
    else {
        return ns.formulas.hacknetNodes.moneyGainRate(nodeInfo.level, nodeInfo.ram * 2, nodeInfo.cores, ns.getPlayer().mults.hacknet_node_money)
            - ns.formulas.hacknetNodes.moneyGainRate(nodeInfo.level, nodeInfo.ram, nodeInfo.cores, ns.getPlayer().mults.hacknet_node_money);
    }
}

export function coreUpgradeProfit(ns, node) {
    const nodeInfo = ns.hacknet.getNodeStats(node);

    if (nodeInfo.cores >= 16) return 9999999;
    else {
        return ns.formulas.hacknetNodes.moneyGainRate(nodeInfo.level, nodeInfo.ram, nodeInfo.cores + 1, ns.getPlayer().mults.hacknet_node_money)
            - ns.formulas.hacknetNodes.moneyGainRate(nodeInfo.level, nodeInfo.ram, nodeInfo.cores, ns.getPlayer().mults.hacknet_node_money);
    }
}
