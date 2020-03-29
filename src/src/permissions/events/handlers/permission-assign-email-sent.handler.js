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
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const permission_assign_email_sent_event_1 = require("../impl/permission-assign-email-sent.event");
const email_util_1 = require("utils/email.util");
const users_dto_1 = require("users/dtos/users.dto");
const projects_dto_1 = require("projects/dtos/projects.dto");
const auth_service_1 = require("auth/auth.service");
let PermissionAssignEmailSentHandler = class PermissionAssignEmailSentHandler {
    constructor(userRepository, projectRepository, authService, eventBus) {
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.authService = authService;
        this.eventBus = eventBus;
    }
    handle(event) {
        return __awaiter(this, void 0, void 0, function* () {
            common_1.Logger.log(event.streamId, 'PermissionAssignEmailSentEvent');
            const { streamId, permissionAssignDto } = event;
            const { assigneeUsername, projectId, permissions, assignerId } = permissionAssignDto;
            try {
                const assignee = yield this.userRepository.findOne({ username: assigneeUsername });
                if (!assignee) {
                    throw new common_1.NotFoundException(`User with username "${assigneeUsername}" does not exist.`);
                }
                permissionAssignDto.assigneeId = assignee._id;
                const project = yield this.projectRepository.findOne({ _id: projectId });
                if (!project) {
                    throw new common_1.NotFoundException(`Project with _id ${projectId} does not exist.`);
                }
                const assigner = yield this.userRepository.findOne({ _id: assignerId });
                if (!assigner) {
                    throw new common_1.NotFoundException(`User with _id ${assignerId} does not exist.`);
                }
                const joinProjectToken = this.authService.generateEmailToken(assigner._id, project._id, assignee._id, permissions);
                yield email_util_1.EmailUtils.sendInviteToJoinProjectEmail(assigner.username, assignee.username, project.name, assignee.email, joinProjectToken);
                this.eventBus.publish(new permission_assign_email_sent_event_1.PermissionAssignEmailSentSuccessEvent(streamId, permissionAssignDto));
            }
            catch (error) {
                this.eventBus.publish(new permission_assign_email_sent_event_1.PermissionAssignEmailSentFailedEvent(streamId, permissionAssignDto, error.toString()));
            }
        });
    }
};
PermissionAssignEmailSentHandler = __decorate([
    cqrs_1.EventsHandler(permission_assign_email_sent_event_1.PermissionAssignEmailSentEvent),
    __param(0, typeorm_1.InjectRepository(users_dto_1.UserDto)),
    __param(1, typeorm_1.InjectRepository(projects_dto_1.ProjectDto)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        auth_service_1.AuthService,
        cqrs_1.EventBus])
], PermissionAssignEmailSentHandler);
exports.PermissionAssignEmailSentHandler = PermissionAssignEmailSentHandler;
let PermissionAssignEmailSentSuccessHandler = class PermissionAssignEmailSentSuccessHandler {
    handle(event) {
        common_1.Logger.log(event.streamId, 'PermissionAssignEmailSentSuccessEvent');
    }
};
PermissionAssignEmailSentSuccessHandler = __decorate([
    cqrs_1.EventsHandler(permission_assign_email_sent_event_1.PermissionAssignEmailSentSuccessEvent)
], PermissionAssignEmailSentSuccessHandler);
exports.PermissionAssignEmailSentSuccessHandler = PermissionAssignEmailSentSuccessHandler;
let PermissionAssignEmailSentFailedHandler = class PermissionAssignEmailSentFailedHandler {
    handle(event) {
        common_1.Logger.log(event.error, 'PermissionAssignEmailSentFailedEvent');
    }
};
PermissionAssignEmailSentFailedHandler = __decorate([
    cqrs_1.EventsHandler(permission_assign_email_sent_event_1.PermissionAssignEmailSentFailedEvent)
], PermissionAssignEmailSentFailedHandler);
exports.PermissionAssignEmailSentFailedHandler = PermissionAssignEmailSentFailedHandler;
//# sourceMappingURL=permission-assign-email-sent.handler.js.map