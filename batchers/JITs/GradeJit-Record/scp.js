import {plan} from "./jit-batcher";

/** @param {NS} ns */
export async function main(ns) {
    for (const server of Object.keys(plan)) {
        ns.scp(["hack.js", "grow.js", "weaken.js"], server)
    }
}