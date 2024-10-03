import {APIGatewayProxyResult} from "aws-lambda";

export interface BadRequestErrorBody {
  message: string;
  error: any;

  [key: string]: any;
}

export class BadRequestError<D = BadRequestErrorBody> implements APIGatewayProxyResult {
  public readonly statusCode: number = 400;
  public readonly body: string;


  public constructor(body: D) {
    this.body = JSON.stringify(body);
  }
}