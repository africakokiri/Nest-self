import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import * as bcrypt from "bcrypt";
import { RegisterUserDto } from "src/auth/auth.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // 유저 회원가입
  async registerUser(registerUserDto: RegisterUserDto) {
    return this.userService.createAndSaveUser(registerUserDto);
  }

  // 유저 로그인
  async loginUser(email: string, password: string) {
    const user = await this.userService.getUserByEmail(email);

    const passwordValidation = bcrypt.compare(password, user.password);

    if (!passwordValidation) {
      throw new UnauthorizedException("비밀번호가 일치하지 않습니다.");
    }

    return {
      accessToken: this.signToken(email, "access"),
      refreshToken: this.signToken(email, "refresh"),
    };
  }

  // Basic token 디코딩
  async decodeBasicToken(rawToken: string) {
    const basicToken = rawToken.split(" ")[1];

    const decodedBasicToken = Buffer.from(basicToken, "base64").toString(
      "utf8",
    );

    const [email, password] = decodedBasicToken.split(":");

    return { email, password };
  }

  // 토큰 발급
  signToken(email: string, tokenType: "access" | "refresh") {
    const payload = {
      email,
    };

    return this.jwtService.sign(payload, {
      secret: "kokiri",
      expiresIn: tokenType === "access" ? 300 : 3600,
    });
  }
}
