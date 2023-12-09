import { Client } from "@rbxts/red";

export function _Init() {
	print("Module initialised duh");
}

export function _CharacterAdded(character: Model) {
	print("Character was added for player: [%s]".format(character.Name));
}

export function _CharacterRemoved(character: Model) {
	print("Character was removed for player: [%s]".format(character.Name));
}
