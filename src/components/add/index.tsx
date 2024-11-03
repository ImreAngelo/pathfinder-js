import adder from './add.js';

export default function wasmAdd(a: number, b: number) {
	return new Promise<number>(async (resolve) => {
		const res = await adder().then(async (instance: { _add: (arg0: number, arg1: number) => number; }) => await instance._add(a, b))
		resolve(res);
	});
}