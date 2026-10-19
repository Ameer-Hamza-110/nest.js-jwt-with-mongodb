import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema.js';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private jwtService: JwtService
    ) { }

    async signup(email: string, password: string) {
        const hash = await bcrypt.hash(password, 10)
        const user = new this.userModel({
            email,
            password: hash
        })
        return user.save()
    }

    async login(email: string, password: string) {
        const user = await this.userModel.findOne({ email })
        if (!user) return null;

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return null;

        const payload = { sub: user._id, email: user.email }

        return {
            access_token: this.jwtService.sign(payload)
        }
    }
}
