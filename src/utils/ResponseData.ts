export class ResponseData {
    status: "success" | "error";
    statusCode: 200 | 400;
    message: string;
    data: any;

    constructor(status: "success" | "error", statusCode: 200 | 400, message: string, data: any) {
        this.status = status;
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
    }
}