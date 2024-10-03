import {IsEmail, IsNotEmpty, IsString, validate} from "class-validator";

export class SignInForm {
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  static from(form: SignInForm) {
    const it = new SignInForm();
    it.password = form.password;
    it.email = form.email;
    return it;
  }

  static async validate(form: SignInForm) {
    const errors = await validate(form);
    if (!errors?.length) {
      return null;
    }

    return errors;
  }
}