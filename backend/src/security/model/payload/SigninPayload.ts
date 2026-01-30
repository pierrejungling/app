import {ApiProperty} from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';

export class SignInPayload {
    @ApiProperty()
    @IsNotEmpty() // USERNAME_IS_NOT_EMPTY
    @Length(1,20) // USERNAME_LENGTH
    username: string;

    @ApiProperty()
    @IsNotEmpty() // PASSWORD_IS_NOT_EMPTY
    @Length(1,20) // PASSWORD_LENGTH
    password: string;

    @ApiProperty()
    @IsOptional() 
    googleHash: string;

    @ApiProperty()
    @IsOptional()
    facebookHash: string;

    @ApiProperty()
    socialLogin: boolean;
}