import {Logger} from '@nestjs/common';
import {EventsHandler, IEventHandler} from '@nestjs/cqrs';
import {InjectRepository} from '@nestjs/typeorm';
import {PermissionDto} from 'permissions/dtos/permissions.dto';
import {Repository} from 'typeorm';
import {PermissionAssignRepliedEvent} from '../impl/permission-assign-replied.event';
import {AuthService} from 'auth/auth.service';

@EventsHandler(PermissionAssignRepliedEvent)
export class PermissionAssignRepliedHandler implements IEventHandler<PermissionAssignRepliedEvent> {
    constructor(
        @InjectRepository(PermissionDto)
        private readonly repository: Repository<PermissionDto>,
        private readonly authService: AuthService,
    ) {
    }

    async handle(event: PermissionAssignRepliedEvent) {
        Logger.log(event.streamId, 'PermissionAssignRepliedEvent'); // write here
        const {streamId, permissionResponseDto} = event;
        const {emailToken, status} = permissionResponseDto;

        try {
            const decodedToken = this.authService.decodeJwtToken(emailToken);
            const assignerId = decodedToken['assignerId'];
            const assigneeId = decodedToken['assigneeId'];
            const projectId = decodedToken['projectId'];
            return await this.repository.update({assigneeId, assignerId, projectId}, {status});
        } catch (error) {
            Logger.error(error, '', 'PermissionAssignRepliedEvent');
        }
    }
}