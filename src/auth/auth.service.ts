import { Injectable, UnauthorizedException, BadRequestException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import CONSTANT from 'src/common/constants/constants';
import { IUser } from 'src/users/interfaces/users.interface';
import { UsersService } from 'src/users/users.service';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
    defaultImage = "https://res.cloudinary.com/chopcolate/image/upload/v1658578988/default_c4s6ix.jpg";
    constructor(
        private user_service: UsersService,
        private jwt_service: JwtService,
        @Inject(CONSTANT.USER_MODEL_TOKEN) private readonly userModel: Model<IUser>,
    ) {}

    async validate(username: string, password: string) {
        const user = await this.userModel.findOne({ username: username }).lean();
        if (user && user.password === password) {
            const payload = { username };
            delete user.password;
            delete user._id;
            return {
                ...user,
                access_token: this.jwt_service.sign(payload),
            }
        }
        throw new UnauthorizedException();
    }

    async register(data: any) {
        const user = await this.userModel.findOne({ username: data.username }).lean();
        if (user) {
            throw new BadRequestException();
        }
        data.avatar = this.defaultImage;
        await this.userModel.create(data);
        return 'success';
    }
}
