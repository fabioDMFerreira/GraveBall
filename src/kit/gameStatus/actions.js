import {
	START_GAME,
	STOP_GAME,
	CONTINUE_GAME,
	GAME_WON,
	GAME_LOST,
	SET_CONTROLS_DESCRIPTION,
} from './constants';


export function startGame() {
	return {
		type: START_GAME,
	};
}

export function stopGame() {
	return {
		type: STOP_GAME,
	};
}

export function continueGame() {
	return {
		type: CONTINUE_GAME,
	};
}

export function gameWon() {
	return {
		type: GAME_WON,
	};
}

export function gameLost() {
	return {
		type: GAME_LOST,
	};
}

export function setControlsDescription(description) {
	return {
		type: SET_CONTROLS_DESCRIPTION,
		description,
	};
}
