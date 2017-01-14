import { Lawn } from './Lawn';
import * as fs from 'fs';

describe('Lawn', () => {
	const script = fs.readFileSync(`${process.cwd()}/test/script.txt`, 'utf8');
	it('should run two mowers with final results: 1 3 N and 5 1 E', () => {
		const lawn = Lawn.schedule(script);
		lawn.on('change', (data) => {
			console.log('data', data);
		});
		lawn.run();
		expect(lawn.mowers.length).toEqual(2);
		expect(lawn.mowers[0].getPosition()).toEqual({
			x: 1,
			y: 3,
			d: 'N'
		});
		expect(lawn.mowers[1].getPosition()).toEqual({
			x: 5,
			y: 1,
			d: 'E'
		});
	});
})
