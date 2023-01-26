/* eslint indent: "error", eol-last: ["error", "never"] */
export default class BadRequestErr extends Error {
    statusCode: number;

    constructor(message: string) {
        super(message);
        this.statusCode = 400;
    }
}