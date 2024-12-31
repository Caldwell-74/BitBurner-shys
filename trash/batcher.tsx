import * as React from "react";
export async function main(ns: NS) {}
/*
class UI {
  constructor(batcher) {
    this.batcher = batcher;
    this.ns = this.batcher.ns;
    this.weakenCap = this.batcher['weaken.js'].length;
    this.growCap = this.batcher['grow.js'].length;
    this.hackCap = this.batcher['hack.js'].length;
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
      this.first = performance.now();
    }
    if (message.task === 'hack.js') {
      if (typeof message.result === typeof 0) {
        message.result > 0 ? this.hit++ : this.miss++;
        this.money += message.result;
        this.history.push({ money: message.result, time: performance.now() });
        if (this.history.length > 50) this.history.shift();
      }
    }
  }
  async reDraw() {
    this.ns.tail();
    this.ns.disableLog('ALL');
    this.ns.clearLog();
    while (true) {
      const gains = !this.history.length
        ? 0
        : (this.history.reduce((a, b) => a + b.money, 0) / (this.history.at(-1).time - this.history.at(0).time)) * 1000;
      const time = this.formatTime(this.maxTime + this.batcher.start - performance.now());
      this.ns.setTitle(` Time left: ${time}`);
      const est = this.waiting
        ? '    Waiting for first Hack! '
        : 'Estimated: ' +
          this.ns.formatNumber(
            (this.money / (performance.now() - this.first)) * (this.maxTime - (this.first - this.batcher.start)),
            3,
          );
      this.ns.clearLog();
      this.ns.print(
        [
          `╔${'='.repeat(31)}╗`,
          `║ Money   |   total   | ~ per s ║`,
          `╠${'-'.repeat(31)}╣`,
          `║ ${'│'.padStart(9, ' ')}${this.ns.formatNumber(this.money, 3).padStart(9, ' ').padEnd(9, ' ')}  | ${this.ns
            .formatNumber(gains, 2)
            .padStart(6, ' ')
            .padEnd(7, ' ')} ║`,
          `╠${'-'.repeat(31)}╣`,
          `║${est.padStart(Math.floor(33 - est.length / 2), ' ').padEnd(31, ' ')}║`,
          `╠${'='.repeat(31)}╣`,
          `║` +
            ` H & M  |${this.ns.formatNumber(this.hit, 1, 1000, true).padStart(5, ' ').padEnd(6, ' ')}|${this.ns
              .formatNumber(this.miss, 1, 1000, true)
              .padStart(6, ' ')
              .padEnd(7, ' ')}| ${this.ns
              .formatPercent(this.hit === 0 ? 1 : this.hit / (this.hit + this.miss), 0)
              .padStart(5, ' ')
              .padEnd(6, ' ')}` +
            `║`,
          `╠${'='.repeat(31)}╣`,
          `║${'Task'.padStart(6)}  | ${'Miss'} | ${'Unmet'} | ${'Total'} ║`,
          `╠${'-'.repeat(31)}╣`,
          `║${'Hack'.padStart(6).padEnd(7)} | ${`${this.batcher.missed['hack']}`.padStart(4, ' ').padEnd(5, ' ')}| ${(
            0 + ''
          )
            .padStart(5, ' ')
            .padEnd(6, ' ')}|${(this.hackCap + '').padStart(6, ' ').padEnd(6, ' ')} ║`, //   /${(this.hackCap + "").padStart(5)}`).padStart(10)}`
          `╠${'-'.repeat(31)}╣`,
          `║${'Grow'.padStart(6).padEnd(7)} | ${`${this.batcher.missed['grow']}`.padStart(4, ' ').padEnd(5, ' ')}| ${(
            this.batcher.growTimes.length + ''
          )
            .padStart(5, ' ')
            .padEnd(6, ' ')}|${(this.growCap + '').padStart(6, ' ').padEnd(6, ' ')} ║`, //   ${this.growCap} /`).padStart(10)}`
          `╠${'-'.repeat(31)}╣`,
          `║ ${'Weaken'.padStart(6).padEnd(6)} | ${`0`.padStart(4, ' ').padEnd(5, ' ')}| ${(
            this.batcher.weakenTimes.length + ''
          )
            .padStart(5, ' ')
            .padEnd(6, ' ')}|${(this.weakenCap + '').padStart(6, ' ').padEnd(6, ' ')} ║`, //   /}/${this.weakenCap}`).padStart(10)}`,
          `╚${'='.repeat(31)}╝`,
        ].join('\n'),
      );
      this.ns.resizeTail(328, 430);
      await this.ns.asleep(250);
    }
  }
  formatTime(ms) {
    const ret = [];
    if (ms > msPerMinute) {
      ret.push(Math.floor(ms / msPerMinute) + 'm');
      ms %= msPerMinute;
    }
    if (ms > msPerSecond) {
      ret.push(Math.floor(ms / msPerSecond) + 's');
      ms %= msPerSecond;
    }
    return ret.join(' ');
  }
}
  */
export const setValue_Store: Map<string, Function> = new Map();

interface row_data {
	name: string;
	dynamic?: boolean;
	factor?: number;
	width?: number;
	height?: number;
}
interface row_data_simple extends row_data {
	value: string;
}
interface row_data_dynamic extends row_data {
	value: number;
	dynamic: true;
	format: (v: number) => string;
}

interface row_params {
	sections: Array<row_data_simple | row_data_dynamic>;
	width: number;
	height: number;
	direction: boolean;
	children?: Element;
}
interface simple_box_params {
	data: row_data_simple;
	children?: Element;
}
interface dynamic_box_params {
	data: row_data_dynamic;
	children?: Element;
}

function Row(props: row_params) {
	const dynamic_sections = props.sections.filter((r) => r.factor).length;
	if (dynamic_sections !== props.sections.length) {
		const to_share =
			(1 - props.sections.reduce((a, c) => a + c.factor, 0)) / dynamic_sections;
		for (let i = 0; i > props.sections.length; i++) {
			props.sections[i].factor ||= to_share;
		}
	}
	return (
		<div style={{ width: props.width, height: props.height }}>
			{props.sections.map((box) => {
				if (props.direction) box.width = box.factor;
				else box.height = box.factor;
				return box.dynamic ? (
					<Dynamic_box data={box as row_data_dynamic}></Dynamic_box>
				) : (
					<Simple_box data={box as row_data_simple}></Simple_box>
				);
			})}
		</div>
	);
}

function Dynamic_box(props: dynamic_box_params): React.JSX.Element {
	const [value, setValue] = React.useState(() =>
		props.data.format(props.data.value)
	);
	function update(_value) {
		setValue(props.data.format(_value));
	}
	React.useEffect(() => {
		setValue_Store.set(props.data.name, update);
		return () => void setValue_Store.delete(props.data.name);
	}, []);
	const data = { ...props.data, value: value };
	return (
		<Simple_box data={data as row_data_simple}>{props.children}</Simple_box>
	);
}
function Simple_box(props: simple_box_params): React.JSX.Element {
	return (
		<div
			style={{
				width: props.data.width ?? 100 + "%",
				height: props.data.height ?? 100 + "%",
			}}
		>
			{props.data.value}
		</div>
	);
}
