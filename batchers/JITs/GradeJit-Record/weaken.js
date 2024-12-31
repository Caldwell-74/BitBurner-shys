export async function main(ns) {
    const port = ns.getPortHandle(ns.args[1]);
    const me = ns.getPortHandle(ns.pid);
    me.write(" ");
    me.clear();
    while (true) {
        await me.nextWrite();
        const time = JSON.parse(me.read());
        const delay = Math.max(time.end - time.hacktime * 4 - performance.now(), 0);
        const prom = ns.weaken(ns.args[0], {additionalMsec: delay});
        me.write(Math.trunc(performance.now()) + time.hacktime * 4 + delay);
        const result = await prom;
        port.write(JSON.stringify({task: "weaken.js", id: ns.pid, result}))

    }
}

export const Weaken = "weaken.js";