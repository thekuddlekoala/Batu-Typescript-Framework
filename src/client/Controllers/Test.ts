import { Client } from "@rbxts/red";
const Net = Client("Test");

export function _Init() {
	Net.Fire("Event");
}

export function _CharacterAdded(character: Model) {
	print("Character was added for player: [%s]".format(character.Name));
}

export function _CharacterRemoved(character: Model) {
	print("Character was removed for player: [%s]".format(character.Name));
}
