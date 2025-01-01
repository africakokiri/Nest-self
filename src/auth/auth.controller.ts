import { Body, Controller, Headers, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterUserDto } from "src/auth/auth.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async postLoginUser(@Headers("authorization") authorization: string) {
    const { email, password } =
      await this.authService.decodeBasicToken(authorization);

    return await this.authService.loginUser(email, password);
  }

  @Post("register")
  async postRegisterUser(@Body() registerUserDto: RegisterUserDto) {
    return await this.authService.registerUser(registerUserDto);
  }
}
