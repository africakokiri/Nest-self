import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RegisterUserDto } from "src/auth/auth.dto";
import { UserModel } from "src/user/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
  ) {}

  // 모든 유저 목록 조회
  getAllUsers() {
    return this.userRepository.find();
  }

  // 유저 생성 및 DB에 저장
  async createAndSaveUser(registerUserDto: RegisterUserDto) {
    const { email, nickname } = registerUserDto;

    const checkEmailExist = await this.userRepository.exists({
      where: {
        email,
      },
    });

    if (checkEmailExist) {
      throw new BadRequestException("이미 존재하는 이메일입니다.");
    }

    const checkNicknameExist = await this.userRepository.exists({
      where: {
        nickname,
      },
    });

    if (checkNicknameExist) {
      throw new BadRequestException("이미 존재하는 닉네임입니다.");
    }

    const user = this.userRepository.create(registerUserDto);

    return await this.userRepository.save(user);
  }

  // 이메일로 유저 정보 가져오기
  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw new BadRequestException("유저가 존재하지 않습니다.");
    }

    return user;
  }
}
