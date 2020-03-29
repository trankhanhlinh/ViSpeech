"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const constant_1 = require("../../common/constant");
const auth_service_1 = require("../auth.service");
const orders_dto_1 = require("orders/dtos/orders.dto");
let OrderGuard = class OrderGuard {
    constructor(authService) {
        this.authService = authService;
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const id = request.params['_id'] || request.params['id'];
        if (!id)
            return true;
        const payload = this.authService.decode(request);
        if (!payload || !payload['id'] || !payload['roles']) {
            throw new common_1.BadRequestException();
        }
        if (payload['roles'].includes(constant_1.CONSTANTS.ROLE.ADMIN))
            return true;
        const order = typeorm_1.getMongoRepository(orders_dto_1.OrderDto).findOne({ _id: id });
        if (order['userId'] === payload['id']) {
            return true;
        }
        common_1.Logger.warn('User do not have permission to modify this order.', 'OrderGuard');
        return false;
    }
};
OrderGuard = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], OrderGuard);
exports.OrderGuard = OrderGuard;
//# sourceMappingURL=order.guard.js.map