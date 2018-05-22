import { createStore } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';

import reducer from './reducer';
import { startGame, stopGame, continueGame, gameWon, gameLost, setControlsDescription } from './reducer/gameStatus';
import Countdown from './countdown';
import Keyboard from './keyboard';
import Catchables from './catchables';
import Graveball from './game/graveball';
import { showMenu, hideMenu, showControls, hideControls } from './ui/state';

import { executeFunction, parseArray } from './utils';

export default class Kit {
	constructor() {
		if (process.env.NODE_ENV === 'development') {
			this.store = createStore(reducer, devToolsEnhancer());
		} else {
			this.store = createStore(reducer);
		}
		this.countdown = new Countdown(this.store, this.endOfGame.bind(this));
		this.catchables = new Catchables(this.store);
		this.keyboard = new Keyboard(this.toggleStartGame.bind(this), this.showMenu.bind(this));
		this.game = new Graveball(
			this.keyboard.keysPressed,
			this.endOfGame.bind(this),
			this.catchables,
			this.setControlsDescription.bind(this),
		);
	}

	setControlsDescription(description) {
		this.store.dispatch(setControlsDescription(description));
	}

	endOfGame(result) {
		return result ? this.won() : this.lost();
	}

	load(element) {
		this.game.renderOn(element);
		this.start();
	}

	start() {
		this.store.dispatch(hideMenu());
		this.store.dispatch(startGame());
		this.game.render();
		this.countdown.setTime(300);
		this.countdown.start();
	}

	stop() {
		this.store.dispatch(stopGame());
		this.game.stopRender();
		this.countdown.stop();
	}

	continue() {
		this.store.dispatch(hideMenu());
		this.store.dispatch(hideControls());
		this.store.dispatch(continueGame());
		this.game.render();
		this.countdown.continue();
	}

	/**
	 * Start and stop game.
	 * @param {Array.Function} cbContinue - functions to be called if game was continued
	 * @param {Array.Function} cbStop - functions to be called if game was stopped
	 */
	toggleStartGame(cbContinue = [], cbStop = []) {
		const gameStopped = this.store.getState().get('gameStopped');
		if (gameStopped) {
			this.continue();
			parseArray(cbContinue).forEach(executeFunction);
		} else {
			this.stop();
			cbContinue.forEach(executeFunction);
			parseArray(cbStop).forEach(executeFunction);
		}
	}

	showMenu() {
		this.stop();
		this.store.dispatch(showMenu());
	}

	showControls() {
		this.stop();
		this.store.dispatch(showControls());
	}

	won() {
		this.store.dispatch(gameWon());
		this.stop();
	}

	lost() {
		this.store.dispatch(gameLost());
		this.stop();
	}

	setGameContainerSize(width, height) {
		this.game.setSize(width, height);
	}
}

Kit.prototype.reload = () => window.location.reload();
