#include <emscripten/val.h>
#include <emscripten/bind.h>
#include <emscripten.h>

void draw_map() {
	EM_ASM({
        var canvas = document.getElementById('canvas');
        if (canvas) {
            var ctx = canvas.getContext('2d');
            ctx.fillStyle = 'green';
            ctx.fillRect(10, 10, 150, 100);
        } else {
            console.error("Canvas element with id 'canvas' not found.");
        }
    });
}

EMSCRIPTEN_BINDINGS(map) {
    emscripten::function("draw_map", &draw_map);
}
