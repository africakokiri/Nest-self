import { Controller, Get } from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiOperation } from "@nestjs/swagger";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({
    summary: "모든 유저 목록을 조회합니다.",
  })
  getGetAllUsers() {
    return this.userService.getAllUsers();
  }
}
