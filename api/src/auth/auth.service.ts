import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthService {
    public test() : String {
        return 'Test test! Allah allah!';
    }

    public signIn() : String {
        return 'Login!';
    }

    // private EmailLogin() : Number {
    //     return 1;
    // }

    public signUp() : String {
        return 'Sign up!';
    }
}
