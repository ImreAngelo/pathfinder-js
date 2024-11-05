type RType = {
    data: any;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    nodes?: Coordinate[];
};

export type Coordinate = {
    id: number;
    index: number;
    lon: number;
    lat: number;
}

/** 
 * Render the map in a canvas
 * @param data : any
 * @param canvasID : type - 
 * @returns input data
 **/ 
const drawFeatures = ({ data, canvas, ctx, nodes }: RType) 
: RType => {
    nodes = [];

    data.features.forEach((feature: any, i: number) => {
        // if(!feature.properties.maxspeed)
        //     return;
    
        ctx.beginPath();
        
        feature.geometry.coordinates.forEach(function(coord : number[], index : number) {
            const [x, y] = transformCoordinates(canvas, coord[0], coord[1]);
            if (index === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);

            // TODO: Better road selection
            if(feature.properties.maxspeed)
                nodes.push({id: i, index: index, lon:x, lat:y});
        });
    
        // Style the roads
        // TODO: Move colors to color scheme class
        var speed = feature.properties.maxspeed;
        switch (true) {
            case speed >= 60:
                // ctx.strokeStyle = '#e3a209';
                ctx.strokeStyle = '#5c2306';
                ctx.lineWidth = 2;
                break;
            case speed > 0:
                // ctx.strokeStyle = '#e3a209';
                ctx.strokeStyle = '#5c230650';
                ctx.lineWidth = 2.2;
                break;
            default:
                ctx.strokeStyle = '#ff000010';
                ctx.lineWidth = 1.1;
                break;
        }
    
        ctx.stroke();
    });

    return { data, canvas, ctx, nodes };
};

export default drawFeatures;

// Bounding box for map
export const MIN_LON = 10.31513;
export const MIN_LAT = 63.39713;
export const MAX_LON = 10.52422;
export const MAX_LAT = 63.45887;

// Transform geo-coordinates to canvas coordinates
export function transformCoordinates(canvas: HTMLCanvasElement, lon: number, lat: number) {
    const x = ((lon - MIN_LON) / (MAX_LON - MIN_LON)) * canvas.width;
    const y = canvas.height - ((lat - MIN_LAT) / (MAX_LAT - MIN_LAT)) * canvas.height;
    return [x, y];
}