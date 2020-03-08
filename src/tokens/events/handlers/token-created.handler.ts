import { Logger } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { InjectRepository } from "@nestjs/typeorm";
import { TokenTypeDto } from "tokens/dtos/token-types.dto";
import { TokenDto } from "tokens/dtos/tokens.dto";
import { Repository } from "typeorm";
import { TokenCreatedEvent, TokenCreatedFailEvent } from "../impl/token-created.event";

@EventsHandler(TokenCreatedEvent)
export class TokenCreatedHandler implements IEventHandler<TokenCreatedEvent> {
  constructor(
    @InjectRepository(TokenDto)
    private readonly repository: Repository<TokenDto>,
    @InjectRepository(TokenTypeDto)
    private readonly repositoryTokenType: Repository<TokenTypeDto>
  ) { }

  async handle(event: TokenCreatedEvent) {
    try {
      Logger.log(event.transactionId, "TokenCreatedEvent");
      const token = JSON.parse(JSON.stringify(event.tokenDto));
      const transactionId = event.transactionId;
      let tokenTypeDto = null;
      if (token.tokenTypeId) {
        tokenTypeDto = await this.repositoryTokenType.find({
          _id: token.tokenTypeId
        });
      } else {
        tokenTypeDto = await this.repositoryTokenType.find({
          name: token.tokenType
        });
      }
      token.tokenTypeId = tokenTypeDto[0]._id;
      token.minutes = tokenTypeDto[0].minutes;
      token.transactionId = transactionId;
      delete token.tokenType;
      delete token.orderId;
      return await this.repository.save(token);
    } catch (error) {
      Logger.error('TokenCreatedHanler', 'Something went wrong when create token', error.message);
    }
  }
}

@EventsHandler(TokenCreatedFailEvent)
export class TokenCreatedFailHandler
  implements IEventHandler<TokenCreatedFailEvent> {
  handle(event: TokenCreatedFailEvent) {
    Logger.log(event.transactionId, "TokenCreatedFailEvent");
  }
}
