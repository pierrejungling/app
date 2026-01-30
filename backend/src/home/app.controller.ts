import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { TestException } from './app.exception';
import { AppControllerHelloWorld } from './app.swagger';

@ApiTags('Route de base')
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {
    }
    @ApiOperation(AppControllerHelloWorld)
    @Get()
    getHello(): string {
        return 'Hello World! Exelsior';
    }
}