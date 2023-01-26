/* eslint indent: "error", eol-last: ["error", "never"] */
export default class ForbiddenErr extends Error {
    statusCode: number;

    constructor(message:string) {
        super(message);
        this.statusCode = 403;
    }
}