export function _PreInit() {
	print("Hello, Framework!");
}

export function _CharacterAdded(character: Model) {
	warn("Character was added for player: [%s]".format(character.Name));
}

export function _CharacterRemoved(character: Model) {
	warn("Character was removed for player: [%s]".format(character.Name));
}