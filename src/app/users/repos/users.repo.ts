import {AttributeValue, QueryCommandInput} from "@aws-sdk/client-dynamodb";
import {IsEmail, IsString, validate} from "class-validator";

import {dynamo} from "aws/dynamodb.aws";
import {UserEntity} from "../models/user.model";

export type UsersRepoKey = { id: string; role: string; };

export class UsersRepoFilter {
  @IsEmail()
  email?: string;

  @IsString()
  role?: string;

  get attributes() {
    const attributes: Record<string, AttributeValue> = {};

    if (this.role) {
      attributes[":role"] = {S: this.role,};
    }

    if (this.email) {
      attributes[":email"] = {S: this.email,};
    }

    return attributes;
  }

  get expressions() {
    const expressions: string[] = [];

    if (this.role) {
      expressions.push("role = :role");
    }
    if (this.email) {
      expressions.push("email = :email");
    }

    return expressions;
  }

  static from(query: UsersRepoFilter) {
    const it = new UsersRepoFilter();
    it.email = query.email;
    it.role = query.role;
    return it;
  }

  static async validate(filter: UsersRepoFilter) {
    const errors = await validate(filter);
    if (errors.length) {
      return errors;
    }

    return null;
  }
}

export class UsersRepo {
  readonly name = "users";

  public async find(filter: UsersRepoFilter = new UsersRepoFilter()): Promise<UserEntity[] | null> {
    const ExpressionAttributeValues = {...filter.attributes,};
    const FilterExpression = [...filter.expressions,];
    const args: QueryCommandInput = {
      ExpressionAttributeValues,
      FilterExpression: FilterExpression.join(" and "),
      TableName: this.name,
    };

    if (!FilterExpression.length) {
      delete args.ExpressionAttributeValues;
      delete args.FilterExpression;
    }

    const result = await dynamo.scan(args);
    return result.Items ? result.Items as any[] : null;
  }

  public async findOne({id, role}: UsersRepoKey): Promise<UserEntity | null> {
    const result = await dynamo.query({
      ExpressionAttributeValues: {
        ":id": {S: id,},
        ":role": {S: role,},
      },
      KeyConditionExpression: "id = :id and role = :role",
      TableName: this.name,
    });

    return result.Items ? result.Items[0] as any : null;
  }

  public async findById(id: string): Promise<UserEntity | null> {
    const result = await dynamo.scan({
      ExpressionAttributeValues: {
        ":id": {S: id,},
      },
      FilterExpression: "id = :id",
      TableName: this.name,
    });

    return result.Items ? result.Items[0] as any : null;
  }

  public async findByEmail(email: string): Promise<UserEntity | null> {
    const result = await dynamo.scan({
      ExpressionAttributeValues: {
        ":email": {S: email,},
      },
      FilterExpression: "email = :email",
      TableName: this.name,
    });

    return result.Items ? result.Items[0] as any : null;
  }
}