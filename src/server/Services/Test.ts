import { Server } from "@rbxts/red";
const Net = Server("Test");

export function _Init() {
	Net.On("Event", (player: Player) => {
		warn("%s says: Hello World!".format(player.Name));
	});
}

export function _PlayerAdded(player: Player) {
	print("Player was added with name: [%s]".format(player.Name));
}

export function _CharacterAdded(character: Model) {
	print("Character was added for player: [%s]".format(character.Name));
}

export function _CharacterRemoved(character: Model) {
	print("Character was removed for player: [%s]".format(character.Name));
}
