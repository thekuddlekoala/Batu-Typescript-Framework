import { ReplicatedStorage } from "@rbxts/services";
import { Framework } from "shared/Framework";

const MODULES = ReplicatedStorage.WaitForChild("Modules") as Folder;
const START = tick();

new Framework(MODULES);

warn("SERVER: FRAMEWORK LOADED IN [%d SECONDS]".format(tick() - START));
