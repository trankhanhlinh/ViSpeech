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
const update_project_command_1 = require("../impl/update-project.command");
const project_repository_1 = require("../../repository/project.repository");
const common_1 = require("@nestjs/common");
let UpdateProjectHandler = class UpdateProjectHandler {
    constructor(repository, publisher) {
        this.repository = repository;
        this.publisher = publisher;
    }
    execute(command) {
        return __awaiter(this, void 0, void 0, function* () {
            common_1.Logger.log('Async UpdateProjectHandler...', 'UpdateProjectCommand');
            const { streamId, projectDto } = command;
            const project = this.publisher.mergeObjectContext(yield this.repository.updateProject(streamId, projectDto));
            project.commit();
        });
    }
};
UpdateProjectHandler = __decorate([
    cqrs_1.CommandHandler(update_project_command_1.UpdateProjectCommand),
    __metadata("design:paramtypes", [project_repository_1.ProjectRepository,
        cqrs_1.EventPublisher])
], UpdateProjectHandler);
exports.UpdateProjectHandler = UpdateProjectHandler;
//# sourceMappingURL=update-project.handler.js.map