import { ServerScriptService } from "@rbxts/services";
import { Framework } from "shared/Framework";

const MODULES = ServerScriptService.WaitForChild("TS").WaitForChild("Services") as Folder;
const START = tick();

new Framework(MODULES);

warn("SERVER: FRAMEWORK LOADED IN [%d SECONDS]".format(tick() - START));
