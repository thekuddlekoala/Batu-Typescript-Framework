import { ReplicatedStorage } from "@rbxts/services";
import { Framework } from "shared/Framework";

const MODULES = ReplicatedStorage.WaitForChild("TS").WaitForChild("Controllers") as Folder;
const START = tick();

new Framework(MODULES);

warn("CLIENT: FRAMEWORK LOADED IN [%d SECONDS]".format(tick() - START));
