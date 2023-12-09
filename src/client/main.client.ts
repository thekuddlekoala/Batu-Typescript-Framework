import { ReplicatedStorage, StarterPlayer } from "@rbxts/services";
import { Framework } from "shared/Framework";

const MODULES = ReplicatedStorage.WaitForChild("TS").WaitForChild("Modules") as Folder;
const CONTROLLERS = StarterPlayer.WaitForChild("StarterPlayerScripts")
	.WaitForChild("TS")
	.WaitForChild("Controllers") as Folder;

const START = tick();

new Framework(CONTROLLERS, MODULES);

warn("CLIENT: FRAMEWORK LOADED IN [%d SECONDS]".format(tick() - START));
