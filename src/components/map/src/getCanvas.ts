type RType = {
    data: any;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
};

/** 
 * Render the map in a canvas
 * @param data : any
 * @param canvasID : type - 
 * @returns input data
 **/ 
const getCanvas = (data : any, canvasID : string = 'canvas') : RType => {
    const canvas = document.getElementById(canvasID) as HTMLCanvasElement;
    if(!canvas) {
        console.error(`Canvas element with id '${canvasID}' not found.`);
        throw "Could not find canvas.";
    }

    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    return { data, canvas, ctx };
};

export default getCanvas;