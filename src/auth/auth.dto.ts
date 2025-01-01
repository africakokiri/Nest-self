import { PickType } from "@nestjs/swagger";
import { UserModel } from "src/user/user.entity";

export class RegisterUserDto extends PickType(UserModel, [
  "email",
  "nickname",
  "password",
]) {}

export class LoginUserDto extends PickType(UserModel, [
  "email",
  "password",
]) {}
