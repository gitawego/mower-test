import { EventEmitter2 } from 'eventemitter2';
import { Mower, Position } from './Mower';

export interface LawnSize {
	x: number;
	y: number;
}
export class Lawn extends EventEmitter2 {
	public mowers: Mower[] = [];
	private workingMower: Mower = null;
	constructor(public size: LawnSize) {
		super();
	}
	setWorkingMower(mower: Mower) {
		this.workingMower = mower;
	}
	isWorking() {
		return !!this.workingMower;
	}
	removeMower(mower: Mower) {
		const idx = this.mowers.indexOf(mower);
		if (idx > -1) {
			this.mowers.splice(idx, 1);
		}
	}
	removeMowers() {
		this.mowers.length = 0;
	}
	addMower(position: Position) {
		this.mowers.push(new Mower(position, this));
	}
	schedule() {

	}
}
