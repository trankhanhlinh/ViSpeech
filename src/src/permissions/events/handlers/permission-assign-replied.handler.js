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
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("@nestjs/typeorm");
const permissions_dto_1 = require("permissions/dtos/permissions.dto");
const typeorm_2 = require("typeorm");
const permission_assign_replied_event_1 = require("../impl/permission-assign-replied.event");
const auth_service_1 = require("auth/auth.service");
let PermissionAssignRepliedHandler = class PermissionAssignRepliedHandler {
    constructor(repository, authService) {
        this.repository = repository;
        this.authService = authService;
    }
    handle(event) {
        return __awaiter(this, void 0, void 0, function* () {
            common_1.Logger.log(event.streamId, 'PermissionAssignRepliedEvent');
            const { streamId, permissionResponseDto } = event;
            const { emailToken, status } = permissionResponseDto;
            try {
                const decodedToken = this.authService.decodeJwtToken(emailToken);
                const assignerId = decodedToken['assignerId'];
                const assigneeId = decodedToken['assigneeId'];
                const projectId = decodedToken['projectId'];
                const permissions = decodedToken['permissions'];
                return yield this.repository.update({ assigneeId, assignerId, projectId }, { permissions, status });
            }
            catch (error) {
                common_1.Logger.error(error, '', 'PermissionAssignRepliedEvent');
            }
        });
    }
};
PermissionAssignRepliedHandler = __decorate([
    cqrs_1.EventsHandler(permission_assign_replied_event_1.PermissionAssignRepliedEvent),
    __param(0, typeorm_1.InjectRepository(permissions_dto_1.PermissionDto)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        auth_service_1.AuthService])
], PermissionAssignRepliedHandler);
exports.PermissionAssignRepliedHandler = PermissionAssignRepliedHandler;
//# sourceMappingURL=permission-assign-replied.handler.js.map