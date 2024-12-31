//importing so we can be sure the scripts are compiled on boot of the batcher

const target = "rho-construction";
const threads = {
    "hack.js": 5,
    "grow.js": 10,
    "weaken.js": 1
};
const timeRatio = {
    "hack.js": 1,
    "grow.js": 3.2,
    "weaken.js": 4
};
const mode = "HGW".length;
const msPerMinute = 60 * 1000;
const msPerSecond = 1000;
/** @param {NS} ns */
export const main = async (ns,) => {
    const cont = new Controller(ns, target);
    await cont.init()
};

class Controller {
    constructor(ns, target) {
        this.ns = ns;
        this.target = target;
        this.start = performance.now();
        //pids
        this["weaken.js"] = [];
        this["grow.js"] = [];
        this["hack.js"] = [];
        //endtimes
        this.weakenTimes = [];
        this.growTimes = [];
        //variables
        this.latest = this.start;
        this.hacktime = this.ns.getHackTime(this.target);
        this.count = 0;
        this.spacer = 0;
        this.hack_counter = 0;
        //port just to be sure
        this.port = ns.getPortHandle(ns.pid);
        this.port.write(" ");
        this.port.clear();
        // analytics
        this.missed = {hack: 0, grow: 0};
        // atExit
        this.ns.atExit(() => {
            for (const server of Object.keys(plan)) {
                Object.keys(threads).forEach((s) => this.ns.scriptKill(s, server)
                )
            }
        })

    }

    async init() {
        await this.initialLaunch();
        this.ui = new UI(this);
        this.ui.reDraw();
        await this.ns.asleep(0);
        return this.listener()
    }

    async listener() {
        while (true) {
            this.hacktime = this.ns.getHackTime(this.target);
            this.spacer = this.hacktime * timeRatio["weaken.js"] / this.count / mode;
            do {
                if (this["weaken.js"].length) await this.launchWeakens();
                if (this["grow.js"].length && this.weakenTimes.length) await this.launchGrows();
                if (this["hack.js"].length && this.growTimes.length) await this.launchHacks()
            } while (
                this["weaken.js"].length
                || (this["grow.js"].length && this.weakenTimes.length)
                || (this["hack.js"].length && this.growTimes.length)
                );
            await this.awaitResponce()
        }
    }

    async launchWeakens() {
        const pidW = this["weaken.js"].pop();
        const end = Math.max(this.latest + (this.spacer * mode), performance.now() + this.hacktime * timeRatio["weaken.js"] + mode * this.spacer);
        const ret = await this.launch(pidW, end);
        this.latest = ret;
        this.weakenTimes.unshift(this.latest)
    }

    async launchGrows() {
        const wtime = this.weakenTimes.pop();
        if (wtime - performance.now() - (this.hacktime * timeRatio["grow.js"]) < this.spacer * 1.25) {
            this.missed["grow"] += 1;
            return
        }
        const pidG = this["grow.js"].pop();
        const ret = await this.launch(pidG, wtime - this.spacer);
        this.growTimes.unshift(ret)
    }

    async launchHacks() {
        const gtime = this.growTimes.pop();
        if (gtime - performance.now() - this.hacktime * timeRatio["hack.js"] < this.spacer * 1.25) {
            this.missed["hack"] += 1;
            return
        }
        const pidH = this["hack.js"].pop();
        this.hack_counter++;
        const threads = thread_map.find(x => x[0] <= this.hack_counter)[1];
        await this.launch(pidH, gtime - this.spacer, threads)

    }

    async awaitResponce() {
        while (true) {
            await this.port.nextWrite();
            const responce = JSON.parse(this.port.read());
            this.ui.update(responce);
            this[responce.task].push(responce.id);
            if (responce.task === "weaken.js") return
        }
    }

    async launch(pid, end, threads) {
        const port = this.ns.getPortHandle(pid);
        port.clear();
        port.write(JSON.stringify({end: end, hacktime: this.hacktime, threads}));
        await port.nextWrite();
        return port.read()
    }

    async initialLaunch() {
        for (const [server, tasks] of Object.entries(plan)) {
            for (const [task, amt] of Object.entries(tasks)) {
                for (let i = 0; i < amt; i++) {
                    const pid = this.ns.exec(task, server, {
                        threads: threads[task],
                        temporary: true
                    }, this.target, this.ns.pid);
                    await this.ns.getPortHandle(pid).nextWrite();
                    this[task].push(pid);
                    if (task === "weaken.js") this.count++
                }
            }
        }
    }
}

const plan = {
    "home": {"grow.js": 1602, "hack.js": 501, "weaken.js": 267},
    "n00dles": {"weaken.js": 2},
    "foodnstuff": {"weaken.js": 9},
    "sigma-cosmetics": {"weaken.js": 9},
    "joesguns": {"weaken.js": 9},
    "hong-fang-tea": {"weaken.js": 9},
    "harakiri-sushi": {"weaken.js": 9},
    "iron-gym": {"weaken.js": 18},
    "darkweb": {},
    "zer0": {"weaken.js": 18},
    "nectar-net": {"weaken.js": 9},
    "max-hardware": {"weaken.js": 18},
    "CSEC": {"weaken.js": 4},
    "silver-helix": {"weaken.js": 36},
    "phantasy": {"weaken.js": 18},
    "omega-net": {"weaken.js": 18},
    "neo-net": {"weaken.js": 18},
    "computek": {},
    "netlink": {"weaken.js": 9},
    "avmnite-02h": {"weaken.js": 36},
    "crush-fitness": {},
    "johnson-ortho": {},
    "the-hub": {"weaken.js": 36},
    "I.I.I.I": {"weaken.js": 36},
    "summit-uni": {"weaken.js": 9},
    "zb-institute": {"weaken.js": 18},
    "syscore": {},
    "catalyst": {"weaken.js": 73},
    "rothman-uni": {"weaken.js": 73},
    "alpha-ent": {"weaken.js": 73},
    "millenium-fitness": {"weaken.js": 36},
    "lexo-corp": {"weaken.js": 18},
    "aevum-police": {"weaken.js": 36},
    "rho-construction": {"weaken.js": 9},
    "galactic-cyber": {},
    "aerocorp": {},
    "global-pharm": {"weaken.js": 9},
    "snap-fitness": {},
    "omnia": {"weaken.js": 36},
    "unitalife": {"weaken.js": 18},
    "deltaone": {},
    "univ-energy": {"weaken.js": 73},
    "solaris": {"weaken.js": 9},
    "zeus-med": {},
    "defcomm": {},
    "icarus": {},
    "infocomm": {},
    "taiyang-digital": {},
    "zb-def": {},
    "nova-med": {},
    "applied-energetics": {},
    "titan-labs": {"weaken.js": 73},
    "run4theh111z": {"weaken.js": 292},
    "microdyne": {"weaken.js": 36},
    "fulcrumtech": {"weaken.js": 73},
    "stormtech": {},
    "helios": {"weaken.js": 36},
    "vitalife": {"weaken.js": 36},
    ".": {"weaken.js": 9},
    "omnitek": {"weaken.js": 292},
    "4sigma": {},
    "kuai-gong": {},
    "clarkinc": {},
    "b-and-a": {},
    "blade": {"weaken.js": 73},
    "powerhouse-fitness": {"weaken.js": 4, "hack.js": 1},
    "nwo": {},
    "fulcrumassets": {},
    "megacorp": {},
    "ecorp": {},
    "The-Cave": {}
};
const thread_map = Object.entries({
    "1": 5,
    "11901": 4.999205639456818,
    "12858": 4.9919975982320395,
    "13827": 4.9848263327277955,
    "14809": 4.977691562213394,
    "15805": 4.970593008808206,
    "16814": 4.963530397445572,
    "17837": 4.9565034558372965,
    "18874": 4.949511914438634,
    "19925": 4.942555506413835,
    "20990": 4.935633967602192,
    "22069": 4.928747036484608,
    "23163": 4.921894454150652,
    "24272": 4.915075964266119,
    "25397": 4.908291313041063,
    "26536": 4.901540249198309,
    "27691": 4.894822523942432,
    "28861": 4.888137890929196,
    "30047": 4.881486106235434,
    "31250": 4.8748669283293875,
    "32468": 4.868280118041463,
    "33703": 4.861725438535432,
    "34955": 4.8552026552800385,
    "36224": 4.848711536021029,
    "37510": 4.842251850753589,
    "38813": 4.835823371695171,
    "40134": 4.829425873258721
}).reverse();

class UI {
    constructor(batcher) {
        this.batcher = batcher;
        this.ns = this.batcher.ns;
        this.weakenCap = this.batcher["weaken.js"].length;
        this.growCap = this.batcher["grow.js"].length;
        this.hackCap = this.batcher["hack.js"].length;
        this.money = 0;
        this.waiting = true;
        this.first = null;
        this.history = [];
        this.maxTime = 60 * 60 * 1000;
        this.hit = 0;
        this.miss = 0;

    }

    update(message) {
        if (this.waiting) {
            this.waiting = false;
            this.first = performance.now()
        }
        if (message.task === "hack.js") {
            if (typeof message.result === typeof 0) {
                message.result > 0 ? this.hit++ : this.miss++;
                this.money += message.result;
                this.history.push({money: message.result, time: performance.now()});
                if (this.history.length > 50) this.history.shift()
            }
        }
    }

    async reDraw() {
        this.ns.tail();
        this.ns.disableLog("ALL");
        this.ns.clearLog();
        while (true) {
            const gains = !this.history.length ? 0 : this.history.reduce((a, b) => a + b.money, 0) / (this.history.at(-1).time - this.history.at(0).time) * 1000;
            const time = this.formatTime(this.maxTime + this.batcher.start - performance.now());
            this.ns.setTitle(` Time left: ${time}`);
            const est = (this.waiting ? "    Waiting for first Hack! " : "Estimated: " + this.ns.formatNumber(this.money / (performance.now() - this.first) * (this.maxTime - (this.first - this.batcher.start)), 3));
            this.ns.clearLog();
            this.ns.print([
                `╔${"=".repeat(31)}╗`
                , `║ Money   |   total   | ~ per s ║`
                , `╠${"-".repeat(31)}╣`
                , `║ ${"│".padStart(9, " ")}${this.ns.formatNumber(this.money, 3).padStart(9, " ").padEnd(9, " ")}  | ${this.ns.formatNumber(gains, 2).padStart(6, " ").padEnd(7, " ")} ║`
                , `╠${"-".repeat(31)}╣`
                , `║${est.padStart(Math.floor(33 - (est.length / 2)), " ").padEnd(31, " ")}║`
                , `╠${"=".repeat(31)}╣`
                , `║` + ` H & M  |${(this.ns.formatNumber(this.hit, 1, 1000, true)).padStart(5, " ").padEnd(6, " ")}|${(this.ns.formatNumber(this.miss, 1, 1000, true)).padStart(6, " ").padEnd(7, " ")}| ${(this.ns.formatPercent(this.hit === 0 ? 1 : this.hit / (this.hit + this.miss), 0)).padStart(5, " ").padEnd(6, " ")}` + `║`
                , `╠${"=".repeat(31)}╣`
                , `║${"Task".padStart(6)}  | ${"Miss"} | ${"Unmet"} | ${"Total"} ║`
                , `╠${"-".repeat(31)}╣`
                , `║${"Hack".padStart(6).padEnd(7)} | ${(`${this.batcher.missed["hack"]}`.padStart(4, " ").padEnd(5, " "))}| ${(0 + "").padStart(5, " ").padEnd(6, " ")}|${(this.hackCap + "").padStart(6, " ").padEnd(6, " ")} ║`     //   /${(this.hackCap + "").padStart(5)}`).padStart(10)}`
                , `╠${"-".repeat(31)}╣`
                , `║${"Grow".padStart(6).padEnd(7)} | ${(`${this.batcher.missed["grow"]}`.padStart(4, " ").padEnd(5, " "))}| ${(this.batcher.growTimes.length + "").padStart(5, " ").padEnd(6, " ")}|${(this.growCap + "").padStart(6, " ").padEnd(6, " ")} ║`       //   ${this.growCap} /`).padStart(10)}`
                , `╠${"-".repeat(31)}╣`
                , `║ ${"Weaken".padStart(6).padEnd(6)} | ${(`0`.padStart(4, " ").padEnd(5, " "))}| ${(this.batcher.weakenTimes.length + "").padStart(5, " ").padEnd(6, " ")}|${(this.weakenCap + "").padStart(6, " ").padEnd(6, " ")} ║`       //   /}/${this.weakenCap}`).padStart(10)}`,
                , `╚${"=".repeat(31)}╝`
            ].join("\n"));
            this.ns.resizeTail(328, 430);
            await this.ns.asleep(250)
        }
    }

    formatTime(ms) {
        const ret = [];
        if (ms > msPerMinute) {
            ret.push(Math.floor(ms / msPerMinute) + "m");
            ms %= msPerMinute
        }
        if (ms > msPerSecond) {
            ret.push(Math.floor(ms / msPerSecond) + "s");
            ms %= msPerSecond
        }
        return ret.join(" ")
    }
}