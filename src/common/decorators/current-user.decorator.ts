import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const currentUser = createParamDecorator((data: unknown, ctx: ExecutionContext)=> {
    return ctx.switchToHttp().getRequest().user;
})