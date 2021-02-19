import { HttpException } from "./httpException";

class UserWithThatEmailExistsException extends HttpException {
    constructor( email: string ){
        super(400, `User with this email: ${email} already exists`)
    }
}

export default UserWithThatEmailExistsException;