import {ApiProperty} from '@nestjs/swagger';
import { IsNotEmpty, Length, IsEmail } from 'class-validator';

export class SignupPayload {
    @ApiProperty()
    @IsNotEmpty() // USERNAME_IS_NOT_EMPTY
    @Length(1,20) // USERNAME_LENGTH
    username: string

    @ApiProperty()
    @IsNotEmpty() // PASSWORD_IS_NOT_EMPTY
    @Length(1,20) // PASSWORD_LENGTH
    password: string

    @ApiProperty()
    @IsNotEmpty() // MAIL_IS_NOT_EMPTY
    @IsEmail() // MAIL_IS_EMAIL
    mail: string

    @ApiProperty()
    googleHash: string

    @ApiProperty()
    facebookHash: string
}