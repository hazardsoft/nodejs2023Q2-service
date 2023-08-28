import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User } from './entities/user.entity';
import { IncorrectPasswordError } from './errors';
import { plainToInstance } from 'class-transformer';
import UserRepository from './user.repository';
import { CryptoService } from 'src/crypto/crypto.service';

@Injectable()
export class UserService {
  constructor(
    private readonly repository: UserRepository,
    private readonly cryptoService: CryptoService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await this.cryptoService.hashPassword(
      createUserDto.password,
    );
    return plainToInstance(
      User,
      await this.repository.create({
        ...createUserDto,
        password: hashedPassword,
      }),
    );
  }

  async findAll(): Promise<User[]> {
    return plainToInstance(User, await this.repository.findMany());
  }

  async findOne(id: string): Promise<User | undefined> {
    return plainToInstance(User, await this.repository.findOne(id));
  }

  async findOneByLogin(login: string): Promise<User | undefined> {
    return plainToInstance(User, await this.repository.findOneByLogin(login));
  }

  async updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<User | undefined> {
    const user = await this.repository.findOne(id);
    const isPasswordMatch = await this.cryptoService.isPasswordMatch(
      updatePasswordDto.oldPassword,
      user.password,
    );
    if (!isPasswordMatch) {
      throw new IncorrectPasswordError();
    }
    const hashedPassword = await this.cryptoService.hashPassword(
      updatePasswordDto.newPassword,
    );
    return plainToInstance(
      User,
      await this.repository.update(id, {
        ...updatePasswordDto,
        newPassword: hashedPassword,
      }),
    );
  }

  async isPasswordMatch(login: string, password: string): Promise<boolean> {
    const user = await this.repository.findOneByLogin(login);
    const isPasswordMatch = await this.cryptoService.isPasswordMatch(
      password,
      user.password,
    );
    return isPasswordMatch;
  }

  async remove(id: string): Promise<User | undefined> {
    return plainToInstance(User, await this.repository.delete(id));
  }
}
