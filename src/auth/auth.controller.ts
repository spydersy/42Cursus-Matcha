import { Controller, Post, Get } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
        this.authService.test();
    }

    @Get('signup')
    public signUp() : String {
        return this.authService.signUp();
    }

    @Get('signin')
    public SignIn() : String {      
        return this.authService.signIn();
    }
}