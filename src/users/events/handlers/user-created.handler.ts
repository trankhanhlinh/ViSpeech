import {EventBus, EventsHandler, IEventHandler} from '@nestjs/cqrs';
import {UserCreatedEvent, UserCreatedFailedEvent, UserCreatedSuccessEvent, UserCreationStartedEvent,} from '../impl/user-created.event';
import {Logger} from '@nestjs/common';
import {Repository} from 'typeorm';
import {UserDto} from 'users/dtos/users.dto';
import {Utils} from 'utils';
import {RoleDto} from 'roles/dtos/roles.dto';
import {CONSTANTS} from '../../../common/constant';
import {InjectRepository} from '@nestjs/typeorm';

@EventsHandler(UserCreationStartedEvent)
export class UserCreationStartedHandler implements IEventHandler<UserCreationStartedEvent> {
    handle(event: UserCreationStartedEvent) {
        Logger.log(event.userDto.username, 'UserCreationStartedEvent');
    }
}

@EventsHandler(UserCreatedEvent)
export class UserCreatedHandler implements IEventHandler<UserCreatedEvent> {
    constructor(
        private readonly eventBus: EventBus,
        @InjectRepository(UserDto) private readonly userRepository: Repository<UserDto>,
    ) {
    }

    async handle(event: UserCreatedEvent) {
        Logger.log(event.userDto.username, 'UserCreatedEvent');
        const {streamId, userDto} = event;
        const user = JSON.parse(JSON.stringify(userDto));

        try {
            user.password = Utils.hashPassword(user.password);
            user.roles = Utils.convertToArray(user.roles);
            user.roles = user.roles.map(role => new RoleDto(role.name));
            await this.userRepository.save(user);
            this.eventBus.publish(new UserCreatedSuccessEvent(streamId, userDto));
        } catch (error) {
            this.eventBus.publish(new UserCreatedFailedEvent(streamId, userDto, error));
        }
    }
}

@EventsHandler(UserCreatedSuccessEvent)
export class UserCreatedSuccessHandler implements IEventHandler<UserCreatedSuccessEvent> {
    handle(event: UserCreatedSuccessEvent) {
        Logger.log(event.userDto.username, 'UserCreatedSuccessEvent');
    }
}

@EventsHandler(UserCreatedFailedEvent)
export class UserCreatedFailHandler implements IEventHandler<UserCreatedFailedEvent> {
    handle(event: UserCreatedFailedEvent) {
        Logger.log(event.error, 'UserCreatedFailedEvent');
    }
}
