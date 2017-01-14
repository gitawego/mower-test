import { Lawn } from './Lawn';
import { Mower } from './Mower';
import * as fs from 'fs';

describe('Lawn', () => {
	it('should run mowers from a file content', () => {
		const script = fs.readFileSync(`${process.cwd()}/test/script.txt`, 'utf8');
		const lawn = Lawn.schedule(script);
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
	it('should run two mowers programmatically', () => {
		const lawn = new Lawn({
			x: 5,
			y: 5
		});
		const m1 = lawn.addMower({
			x: 1,
			y: 2,
			d: 'N'
		});
		m1.command('GAGAGAGAA');
		const m2 = lawn.addMower({
			x: 3,
			y: 3,
			d: 'E'
		});
		m2.command('AADAADADDA');
		expect(m1.getPosition()).toEqual({
			x: 1,
			y: 3,
			d: 'N'
		});
		expect(m2.getPosition()).toEqual({
			x: 5,
			y: 1,
			d: 'E'
		});
	});
	it('should receive events about movement', () => {
		const lawn = new Lawn({
			x: 5,
			y: 5
		});
		const movements = [];
		const m1 = lawn.addMower({
			x: 1,
			y: 2,
			d: 'N'
		});
		lawn.on('change', (evt) => {
			expect(evt.mower).toEqual(m1);
			movements.push(evt.mower.getPosition());
		});

		m1.command('GAGAGAGAA');
		expect(movements).toEqual([{ x: 1, y: 2, d: 'W' },
		{ x: 0, y: 2, d: 'W' },
		{ x: 0, y: 2, d: 'S' },
		{ x: 0, y: 1, d: 'S' },
		{ x: 0, y: 1, d: 'E' },
		{ x: 1, y: 1, d: 'E' },
		{ x: 1, y: 1, d: 'N' },
		{ x: 1, y: 2, d: 'N' },
		{ x: 1, y: 3, d: 'N' }]);
	});
})
