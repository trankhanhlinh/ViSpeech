import { Controller, UseGuards, Get, Query, Param, Req, ForbiddenException, Put, Body } from "@nestjs/common"; import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger"; import { AuthGuard } from "@nestjs/passport"; import { CONSTANTS } from "common/constant";
import { RequestService } from "requests/services/request.service";
import { FindRequestsQuery } from "requests/queries/impl/find-requests.query";
import { FindRequestsParam, RequestIdParamsDto, RequestDto } from "requests/dtos/requests.dto";
import { Roles } from "auth/roles.decorator";
import { AuthService } from "auth/auth.service";
import { RequestGuard } from "auth/guards/request.guard";
import { FindRequestsByUserIdQuery } from "requests/queries/impl/find-requests-by-userId.query";

@Controller('requests')
@ApiTags('requests')
@UseGuards(AuthGuard(CONSTANTS.AUTH_JWT), RequestGuard)
export class HistoriesController {
    constructor(
        private readonly authService: AuthService,
        private readonly requestService: RequestService,
    ) {
    }

    /* List Requests by projectId*/
    /*--------------------------------------------*/
    @ApiOperation({ tags: ['List Request by projectId'] })
    @ApiResponse({ status: 200, description: 'List Request by projectId.' })
    @Get('/projectId/:projectId')
    async findRequestsByProjectId(@Query() findRequestsQuery: FindRequestsQuery,
        @Param() requestsParam: FindRequestsParam, @Req() req) {
        const payload = this.authService.decode(req);
        findRequestsQuery.tokenId = payload['id'];
        findRequestsQuery.projectId = requestsParam.projectId;
        return this.requestService.findRequests(findRequestsQuery);
    }

    /* List Requests */
    /*--------------------------------------------*/
    @ApiOperation({ tags: ['List Request'] })
    @ApiResponse({ status: 200, description: 'List Request.' })
    @Roles([CONSTANTS.ROLE.ADMIN])
    @Get()
    async findRequests(@Query() findRequestsQuery: FindRequestsQuery) {
        return this.requestService.findRequests(findRequestsQuery);
    }

    /* List Requests By UserId */
    /*--------------------------------------------*/
    @ApiOperation({ tags: ['List Request By UserId'] })
    @ApiResponse({ status: 200, description: 'List Request By UserId.' })
    @Get('/userId/:userId')
    async findRequestsByUserId(@Param() requestsParam: FindRequestsParam, @Query() query: FindRequestsByUserIdQuery) {
        query.userId = requestsParam.userId;
        return this.requestService.findRequestsByUserId(query);
    }

    /* Update Request TranscriptFileUrl */
    /*--------------------------------------------*/
    @ApiOperation({ tags: ['Update Request TranscriptFileUrl'] })
    @ApiResponse({ status: 200, description: 'Update Request TranscriptFileUrl.' })
    @Put('/transcriptFileUrl/:_id')
    async updateProject(
        @Param() requestIdDto: RequestIdParamsDto,
        @Body() body,
    ) {
        const streamId = requestIdDto._id;
        return this.requestService.updateRequestTranscriptFileUrl(streamId, requestIdDto._id, body.transcriptFileUrl);
    }
}