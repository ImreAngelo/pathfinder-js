/** Render the
 * 
 * @data : any
 * @canvasID : type string :
 **/ 
const renderCanvas = (data : any, canvasID : string = 'canvas') => {
    const canvas = document.getElementById(canvasID) as HTMLCanvasElement;
    if(!canvas) {
        console.error(`Canvas element with id '${canvasID}' not found.`);
        return;
    }

    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Transform geo-coordinates to canvas coordinates
    function transformCoordinates(lon : number, lat : number) {
        // Bounding box for map
        const minLon = 10.31513;
        const minLat = 63.39713;
        const maxLon = 10.52422;
        const maxLat = 63.45887;
        
        const x = ((lon - minLon) / (maxLon - minLon)) * canvas.width;
        const y = canvas.height - ((lat - minLat) / (maxLat - minLat)) * canvas.height;
        return [x, y];
    }
    
    // Iterate over the features in the GeoJSON data
    data.features.forEach(function(feature : any) {
        if (feature.geometry.type === 'LineString') {
            ctx.beginPath();
            feature.geometry.coordinates.forEach(function(coord : number[], index : number) {
                const [x, y] = transformCoordinates(coord[0], coord[1]);
                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });

            // Style the roads
            // TODO: Move colors to color scheme class
            var highwayType = feature.properties.highway;
            switch (highwayType) {
                case 'primary':
                    // ctx.strokeStyle = '#e3a209';
                    ctx.strokeStyle = '#5c2306';
                    ctx.lineWidth = 2.2;
                    break;
                default:
                    ctx.strokeStyle = '#5c230650';
                    ctx.lineWidth = 0.45;
            }
            ctx.stroke();
        }
    });

    return data;
}

export default renderCanvas;