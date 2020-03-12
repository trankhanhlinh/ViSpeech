import { CanActivate, Injectable, Logger } from "@nestjs/common";
import { ReportDto } from "reports/dtos/reports.dto";
import { getMongoRepository } from "typeorm";
import { CONSTANTS } from "../../common/constant";
import { AuthService } from "../auth.service";

@Injectable()
export class OrderGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService,
    ) {
    }

    canActivate(context: import("@nestjs/common").ExecutionContext): boolean | Promise<boolean> | import("rxjs").Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const id = request.params['_id'] || request.parms['id'];
        if (!id) return true;
        const payload = this.authService.decode(request);
        if (payload['roles'])
            if (payload['roles'].includes(CONSTANTS.ROLE.ADMIN)) return true;
        const order = getMongoRepository(ReportDto).findOne({ _id: id });
        if (order['userId'] !== payload['id']) {
            Logger.warn('User do not have permission to modify this order.', 'OrderGuard')
            return false;
        }
        return true;
    }
}