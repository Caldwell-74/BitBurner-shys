export async function main(ns) {
    const port = ns.getPortHandle(ns.args[1]);
    const me = ns.getPortHandle(ns.pid);
    me.write(" ");
    me.clear();
    while (true) {
        await me.nextWrite();
        const time = JSON.parse(me.read());
        const delay = time.end - (performance.now() + (3.2 * time.hacktime));
        const prom = ns.grow(ns.args[0], {additionalMsec: delay});
        me.write(Math.trunc(performance.now()) + 3.2 * time.hacktime + delay);
        const result = await prom;
        port.write(JSON.stringify({task: "grow.js", id: ns.pid, result}))
    }
}

export const Grow = "grow.js";