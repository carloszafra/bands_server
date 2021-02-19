import { IsString, IsNotEmpty, MinLength, IsEmail } from "class-validator";

class UserDto {
    @IsString()
    @IsNotEmpty()
    public name: string;
    
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    public email: string;
    
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    public password: string;
}

export default UserDto;