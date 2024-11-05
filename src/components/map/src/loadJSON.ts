import { Just } from "../../monads/just";
import { Maybe } from "../../monads/maybe";
import { Nothing } from "../../monads/nothing";

export const fetchFile = async (url: string): Promise<Maybe<Response>> => {
    return fetch(url)
        .then(response => new Just<Response>(response))
        .catch(() => new Nothing<Response>());
};

export const parseJSON = async (response: Maybe<Response>): Promise<Maybe<JSON>> => {
    if (response instanceof Nothing)
        return Promise.resolve(new Nothing());

    return (response as unknown as Just<Response>).getValue().json();
}

export const loadJSON = (url: string): Promise<Maybe<JSON>> => fetchFile(url).then(parseJSON);

export default loadJSON;