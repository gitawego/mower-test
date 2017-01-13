export interface InitPosition {
	x: string;
	y: string;
	/** orientation */
	o: string;
}
export enum Orientation {
	N,
	E,
	S,
	W
};
export class Mower {
	static DIRECTION = ['N', 'E', 'S', 'W'];
	constructor(private initPosition: InitPosition) {

	}

}
