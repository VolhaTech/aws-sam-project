import {APIGatewayProxyResult} from "aws-lambda";

export interface ResponseSuccessBody {
  [key: string]: any;
}

export class ResponseSuccess<D = ResponseSuccessBody> implements APIGatewayProxyResult {
  public readonly statusCode: number = 200;
  public readonly body: string;

  public constructor(body: D) {
    this.body = JSON.stringify(body);
  }
}