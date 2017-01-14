import { EventEmitter2 } from 'eventemitter2';
import { Mower, Position, Direction } from './Mower';

export interface LawnSize {
	x: number;
	y: number;
}
export interface ScheduleOption {
	checkColision?: boolean;
}
export class Lawn extends EventEmitter2 {
	public mowers: Mower[] = [];
	private workingMower: Mower = null;
	private orders: string[] = [];
	static schedule(script: string, opt?: ScheduleOption) {
		const lines = script.split('\n').filter((i) => i.trim());
		const size = lines.shift().trim().split(' ');
		const lawn = new Lawn({
			x: Number(size[0]),
			y: Number(size[1])
		});
		lawn.setOrders(lines);
		return lawn;
	}
	constructor(public size: LawnSize) {
		super();
	}
	setWorkingMower(mower: Mower) {
		this.workingMower = mower;
	}
	setOrders(orders: string[]) {
		this.orders = orders;
	}
	addOrder(order: string) {
		this.orders.push(order);
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
		const mower = new Mower(position, this);
		this.mowers.push(mower);
		return mower;
	}
	run(orders: string[] = this.orders) {
		const l = orders.length;
		for (let i = 0; i < l; i++) {
			if (i % 2 === 0) {
				const pos = orders[i].split(' ');
				const mower = this.addMower({
					x: Number(pos[0]),
					y: Number(pos[1]),
					d: <Direction>pos[2]
				});
				mower.command(orders[++i]);
			}
		}
	}
}
