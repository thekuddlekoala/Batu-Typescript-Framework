import { Client, Server } from "@rbxts/red";
import { Players, RunService } from "@rbxts/services";

type Element = {
	//* Default Functions
	_PreInit?: () => undefined;
	_Init?: () => undefined;
	_PostInit?: () => undefined;

	//* Connection Functions
	_PlayerAdded?: (player: Player) => undefined;
	_PlayerRemoved?: (player: Player) => undefined;
	_CharacterAdded?: (character: Model) => undefined;
	_CharacterRemoved?: (character: Model) => undefined;
	_CharacterAppearanceAdded?: (character: Model) => undefined;
};

const IS_SERVER = RunService.IsServer();

export class Framework {
	path: Folder;
	cached: Map<string, Element>;
	addedCache: Array<Element>;
	removedCache: Array<Element>;

	constructor(path: Folder) {
		this.path = path;
		this.cached = new Map<string, Element>();
		this.addedCache = new Array<Element>();
		this.removedCache = new Array<Element>();

		this.start();
	}

	start() {
		this.path.GetDescendants().forEach((child) => {
			if (!child.IsA("ModuleScript")) {
				return;
			}

			const result = require(child) as Element;
			this.cached.set(child.Name, result);
		});

		//* Pre-Init
		this.cached.forEach((info, _) => {
			if (info._PreInit) {
				info._PreInit();
			}
		});

		//* Init
		this.cached.forEach((info, _) => {
			if (info._Init) {
				info._Init();
			}
		});

		//* Connections
		if (IS_SERVER) {
			this.cached.forEach((info, _) => {
				if (
					info._PlayerAdded ||
					info._CharacterAdded ||
					info._CharacterAppearanceAdded ||
					info._CharacterRemoved
				) {
					this.addedCache.push(info);
				}

				if (info._PlayerRemoved) {
					this.removedCache.push(info);
				}
			});
		} else {
			const player = Players.LocalPlayer;

			this.cached.forEach((info, _) => {
				if (info._CharacterAdded) {
					player.CharacterAdded.Connect(info._CharacterAdded);
				}

				if (info._CharacterAppearanceAdded) {
					player.CharacterAppearanceLoaded.Connect(info._CharacterAppearanceAdded);
				}

				if (info._CharacterRemoved) {
					player.CharacterRemoving.Connect(info._CharacterRemoved);
				}
			});
		}

		this.manageCached();

		//* Post Init
		this.cached.forEach((info, _) => {
			if (info._PostInit) {
				info._PostInit();
			}
		});
	}

	manageCached() {
		Players.PlayerAdded.Connect((player: Player) => {
			this.addedCache.forEach((element) => {
				if (element._PlayerAdded) {
					element._PlayerAdded(player);
				}

				if (element._CharacterAdded) {
					player.CharacterAdded.Connect(element._CharacterAdded);
				}

				if (element._CharacterAppearanceAdded) {
					player.CharacterAppearanceLoaded.Connect(element._CharacterAppearanceAdded);
				}

				if (element._CharacterRemoved) {
					player.CharacterRemoving.Connect(element._CharacterRemoved);
				}
			});
		});

		Players.PlayerRemoving.Connect((player: Player) => {
			this.addedCache.forEach((element) => {
				if (element._PlayerRemoved) {
					element._PlayerRemoved(player);
				}
			});
		});
	}
}

class ServerRS {
	name: string;
	net: Server;
	callbacks: Array<(player: Player, ...args: unknown[]) => unknown>;

	constructor(name: string) {
		this.name = name;
		this.net = Server("_remoteSignals");
		this.callbacks = new Array<(player: Player, ...args: unknown[]) => unknown>();

		//* Setup the callback connection
		this.net.On(name, (player: Player, ...args: unknown[]) => {
			this.callbacks.forEach((callback) => {
				callback(player, args);
			});
		});
	}

	connect(callback: (player: Player, ...args: unknown[]) => unknown) {
		this.callbacks.push(callback);

		//* Returns a cleanup function
		return () => {
			const index = this.callbacks.indexOf(callback);

			if (index !== -1) {
				this.callbacks.remove(index);
			}
		};
	}

	fire(player: Player, ...args: unknown[]) {
		this.net.Fire(player, this.name, args);
	}

	fireAll(...args: unknown[]) {
		this.net.FireAll(this.name, args);
	}

	fireAllExcept(exclude: Player, ...args: unknown[]) {
		this.net.FireAllExcept(exclude, this.name, args);
	}

	fireWithFilter(filter: (player: Player) => boolean, ...args: unknown[]) {
		this.net.FireWithFilter(filter, this.name, args);
	}

	fireList(list: Player[], ...args: unknown[]) {
		this.net.FireList(list, this.name, args);
	}
}

class ClientRS {
	name: string;
	net: Client;
	callbacks: Array<(...args: unknown[]) => unknown>;

	constructor(name: string) {
		this.name = name;
		this.net = Client("_remoteSignals");
		this.callbacks = new Array<(...args: unknown[]) => unknown>();

		//* Setup the callback connection
		this.net.On(name, (...args: unknown[]) => {
			this.callbacks.forEach((callback) => {
				callback(args);
			});
		});
	}

	connect(callback: (...args: unknown[]) => unknown) {
		this.callbacks.push(callback);

		//* Returns a cleanup function
		return () => {
			const index = this.callbacks.indexOf(callback);

			if (index !== -1) {
				this.callbacks.remove(index);
			}
		};
	}

	fire(...args: unknown[]) {
		this.net.Fire(this.name, args);
	}

	invoke(...args: unknown[]) {
		return this.net.Call(this.name, args);
	}
}

export function RemoteSignal(name: string) {
	return (IS_SERVER && new ServerRS(name)) || new ClientRS(name);
}
