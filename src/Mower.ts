import { EventEmitter2 } from 'eventemitter2';
import { Lawn } from './Lawn';
export interface Position {
	x: number;
	y: number;
	/** orientation */
	d: Direction;
}
export type Axis = 'x' | 'y';
export type TurnDirection = "G" | "D";
export type Actions = 'A' | TurnDirection;
export type Direction = 'N' | 'E' | 'S' | 'W';
export interface ColisionResult {
	hasColision: boolean;
	mower: Mower;
}
export interface NextMove {
	axis: Axis;
	value: number;
}
export class Mower extends EventEmitter2 {
	static DIRECTIONS: Direction[] = ['N', 'E', 'S', 'W'];
	static TURN_DIRECTION = {
		G: -1,
		D: 1
	};
	static MOVE_DIRECTION = {
		N: ["y", 1],
		S: ["y", -1],
		E: ["x", 1],
		w: ["x", -1]
	}
	constructor(private position: Position, private lawn: Lawn) {
		super();
		this.on('change', (data) => {
			this.lawn.emit('change', {
				mower: this,
				data
			});
		});
		this.on('warn', (data) => {
			this.lawn.emit('warn', data);
		});
	}
	command(script: string) {
		if (this.lawn.isWorking()) {
			this.emit('error', {
				error: 'one mower is working'
			});
			return;
		}
		const cmds = <Actions[]>script.split('');
		this.lawn.setWorkingMower(this);
		cmds.forEach((cmd) => {
			if (cmd === 'A') {
				this.move();
			} else {
				this.changeDirection(cmd);
			}
		});
		this.lawn.setWorkingMower(null);
	}
	getPosition() {
		return { ...this.position };
	}
	remove() {
		this.removeAllListeners();
		this.lawn.removeMower(this);
	}
	getNextDirection(turn: TurnDirection): Direction {
		const currentDirectionIndex = Mower.DIRECTIONS.indexOf(this.position.d);
		let directionIndex = Mower.TURN_DIRECTION[turn] + currentDirectionIndex;
		if (directionIndex === -1) {
			directionIndex = 3;
		} else {
			directionIndex = directionIndex % 4;
		}
		return Mower.DIRECTIONS[directionIndex];
	}
	changeDirection(turn: TurnDirection) {
		const prevValue = this.position.d;
		this.position.d = this.getNextDirection(turn);
		this.emit('change', {
			prevValue,
			currentValue: this.position.d,
			key: 'direction'
		});
	}
	getNextMove(): NextMove {
		const moveConfig = Mower.MOVE_DIRECTION[this.position.d];
		const nextMove: NextMove = {
			axis: moveConfig[0],
			value: 0
		};
		nextMove['value'] = this.position[nextMove.axis] + moveConfig[1];
		if (nextMove['value'] < 0) {
			nextMove['value'] = 0;
		} else if (nextMove['value'] > this.lawn.size[nextMove.axis]) {
			nextMove['value'] = this.lawn.size[nextMove.axis];
		}
		return nextMove;
	}
	move() {
		const nextMove = this.getNextMove();
		const prevValue = this.position[nextMove.axis];
		if (prevValue === nextMove.value) {
			return;
		}
		const colision = this.checkColision(nextMove);
		if (colision.hasColision) {
			this.emit('warn', {
				error: 'colision',
				mower: colision.mower
			});
			return;
		}
		this.position[nextMove.axis] = nextMove.value;
		this.emit('change', {
			prevValue,
			currentValue: nextMove.value,
			key: nextMove.axis
		});
	}
	checkColision(nextMove: NextMove): ColisionResult {
		let colisionWith: Mower = null;
		const hasColision = this.lawn.mowers.some((mower) => {
			if (mower === this) {
				return false;
			}
			const pos = mower.position;
			if (pos.x === this.position.x && pos.y === this.position.y) {
				colisionWith = mower;
				return true;
			}
			return false;
		});
		return {
			hasColision,
			mower: colisionWith
		}
	}
}

