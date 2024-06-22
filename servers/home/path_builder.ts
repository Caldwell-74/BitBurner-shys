interface Path_Data extends ServerWrapper {
	parent: string;
	childs: Path_Data[];
	get Parents(): () => string;
	get Childs(): () => Path_Data[];
}
export const Servers: Map<string, Path_Data | ServerWrapper> = new Map();

export function pathFinder(ns: NS): Path_Data[] {
	return [] as Path_Data[];
}
export function find_server(
	ns: NS,
	callback?: (ns: NS, server: string, neighbours: string[]) => any,
	array?: boolean
) {
	const all_Server = new Set(["home"]);
	all_Server.forEach((server) => {
		const neighbours = ns.scan(server).slice(+(server !== "home"));
		neighbours.forEach((found) => all_Server.add(found));

		if (callback) callback(ns, server, neighbours);
	});

	return array ? Array.from(all_Server) : all_Server;
}
function isString(data:unknown): data is String{
     return typeof data === "string"
}
function add_server(ns, server, neighbours) {
	if (!Servers.has(server)) {
		const serverC = new ServerWrapper(ns, server, neighbours);
		Servers.set(server, serverC);
	}
}
interface ServerWrapper extends Server {}
interface Child_Data {
    string:string[];
    obj?:Path_Data[]
}

class ServerWrapper {
	#ns: NS;
    #name: string;
	#children: Child_Data;
	constructor(ns: NS, name: string, neighbours: string[]) {
		this.#ns = ns;
		this.#children = {"string":neighbours};
		this.#name = name;
		this.#update();
	}
    get name(){
        return this.#name
    }
    get Childs(){
        return this.#children
    }
    get Parents(){
        this.#parents = 
        return 
    }
	#update() {
		Object.assign(this, this.#ns.getServer(this.#name));
	}
    #transform(){
        if(isString(this.#children[0])){
            this.#children = this.#children.map((child)=> Servers.get(child))
        }else{
            this.#children = this.#children.map((child:Path_Data)=> child.name)
        }
    }
    #build_path(){
        if(typeof this.#children[0] === "string"){
            this.#children = this.#children.map((child)=> Servers.get(child))
        }else{
            this.#children = this.#children.map((child)=> child.name)
        }
    }
}
