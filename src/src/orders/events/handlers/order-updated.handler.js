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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const cqrs_1 = require("@nestjs/cqrs");
const order_updated_event_1 = require("../impl/order-updated.event");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const orders_dto_1 = require("orders/dtos/orders.dto");
const typeorm_2 = require("typeorm");
const utils_1 = require("utils");
let OrderUpdatedHandler = class OrderUpdatedHandler {
    constructor(repository) {
        this.repository = repository;
    }
    handle(event) {
        return __awaiter(this, void 0, void 0, function* () {
            common_1.Logger.log(event.orderDto._id, 'OrderUpdatedEvent');
            const { streamId, orderDto } = event;
            const { _id } = orderDto, orderInfo = __rest(orderDto, ["_id"]);
            try {
                const formattedOrderInfo = utils_1.Utils.removePropertiesFromObject(orderInfo, ['tokenType']);
                return yield this.repository.update({ _id }, formattedOrderInfo);
            }
            catch (error) {
                common_1.Logger.error(error, '', 'OrderUpdatedEvent');
            }
        });
    }
};
OrderUpdatedHandler = __decorate([
    cqrs_1.EventsHandler(order_updated_event_1.OrderUpdatedEvent),
    __param(0, typeorm_1.InjectRepository(orders_dto_1.OrderDto)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], OrderUpdatedHandler);
exports.OrderUpdatedHandler = OrderUpdatedHandler;
//# sourceMappingURL=order-updated.handler.js.map