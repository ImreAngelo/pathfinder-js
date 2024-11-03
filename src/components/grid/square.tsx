import { Component, createSignal } from "solid-js";

interface SquareProps {
	x : number;
    y : number;
    state : boolean;
    highlight: boolean;
}

const Square : Component<SquareProps> = (props) => {
    const [state, setState] = createSignal<boolean>(props.state);

    return (
        <div class={`square${state() ? " unwalkable" : ""}${props.highlight ? " highlight" : ""}`} onclick={() => {
            setState(!state());
        }}>
            ({props.x}, {props.y})
        </div>
    )
}

export default Square;