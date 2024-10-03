import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";

import {BadRequestError} from "shared/responses/bad-request.response";
import {ResponseSuccess} from "shared/responses/success.response";

import {UsersRepo} from "app/users/repos/users.repo";
import {UserDto} from "app/users/models/user.model";

import {SignInForm} from "./models/sign-in.form";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const body = JSON.parse(event.body as string);

  const form = SignInForm.from(body);
  const errors = await SignInForm.validate(form);
  if (errors) {
    return new BadRequestError({message: "invalid form", errors});
  }

  const users_repo = new UsersRepo();

  const entity = await users_repo.findByEmail(form.email);
  if (!entity) {
    return new BadRequestError({message: "user not found", errors});
  }

  if(entity.password.S !== form.password) {
    return new BadRequestError({message: "invalid pass", errors});
  }

  const user = UserDto.fromEntity(entity);

  return new ResponseSuccess({access_token: ""});
};