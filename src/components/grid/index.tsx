import { createSignal, onMount } from 'solid-js';
import wasmAdd from '../add';

const Add = () => {
	const [result, setResult] = createSignal<number | null>(null);

	onMount(async () => {
		try {
			wasmAdd(5, 7).then(setResult);
		} catch (error) {
			console.error('Failed to load wasm module:', error);
		}
	});

	return (
		<div>
			<p>Result of 5 + 7: {result() !== null ? result() : 'Loading...'}</p>
		</div>
	);
};

export default Add;