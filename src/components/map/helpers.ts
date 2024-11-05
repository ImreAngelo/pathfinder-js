import Task from "../monads/task";

export const fetchFile = (url: string): Task<Response> => Task.fromPromise(fetch(url));
export const parseJSON = (response: Response): Task<any> => Task.fromPromise(response.json());
export const loadJSON = (url: string): Task<any> => fetchFile(url).chain(parseJSON);

export const getCanvas = (id: string): Task<HTMLCanvasElement | null> => Task.of(document.querySelector(id));

export const drawFeatures = (data: any) => (canvas: HTMLCanvasElement | null): Task<HTMLCanvasElement | null> => {
	if (!canvas) return Task.of(null);

	const context = canvas.getContext('2d');
	if (!context) return Task.of(null);

	data.features.forEach((feature: any) => {
		// Example drawing operation
		context.fillRect(feature.x, feature.y, 0.1, 0.1);
	});

	return Task.of(canvas);
};

export const addListener = (canvas: HTMLCanvasElement | null): Task<HTMLCanvasElement | null> => {
	if (!canvas) return Task.of(null);

	canvas.addEventListener('click', () => {
		console.log('Canvas clicked');
	});

	return Task.of(canvas);
};

export const load = (data: any): Task<void> => {
	// Assume load takes the data and does something with it.
	return Task.of(console.log('Loading data into WebAssembly', data));
};
