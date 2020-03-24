import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CONSTANTS } from 'common/constant';
import { FindPermissionQuery } from 'permissions/queries/impl/find-permission.query';
import { GetPermissionsQuery } from 'permissions/queries/impl/get-permissions.query';
import { PermissionDto, PermissionIdRequestParamsDto, PermissionAssignDto } from '../dtos/permissions.dto';
import { PermissionsService } from '../services/permissions.service';
import { Roles } from 'auth/roles.decorator';
import { PermissionGuard } from 'auth/guards/permission.guard';
import { AssignRoleGuard } from 'auth/guards/assign-role.guard';
import { Utils } from 'utils';

@Controller('permissions')
@ApiTags('Permissions')
@UseGuards(AuthGuard(CONSTANTS.AUTH_JWT), PermissionGuard)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) { }

  /*--------------------------------------------*/
  @ApiOperation({ tags: ['Create Permission'] })
  @ApiResponse({ status: 200, description: 'Create Permission.' })
  @Post()
  async createPermission(@Body() permissionDto: PermissionDto): Promise<PermissionDto> {
    const streamId = permissionDto._id;
    return this.permissionsService.createPermission(streamId, permissionDto);
  }

  /* Update Permission */
  /*--------------------------------------------*/
  @ApiOperation({ tags: ['Update Permission'] })
  @ApiResponse({ status: 200, description: 'Update Permission.' })
  @Put(':_id')
  async updatePermission(
    @Param() permissionIdDto: PermissionIdRequestParamsDto,
    @Body() permissionDto: PermissionDto,
  ) {
    const streamId = permissionIdDto._id;
    return this.permissionsService.updatePermission(streamId, {
      ...permissionDto,
      _id: permissionIdDto._id,
    });
  }

  /* Delete Permission */
  /*--------------------------------------------*/
  @ApiOperation({ tags: ['Delete Permission'] })
  @ApiResponse({ status: 200, description: 'Delete Permission.' })
  @Roles([CONSTANTS.ROLE.ADMIN, CONSTANTS.ROLE.MANAGER_USER])
  @Delete(':_id')
  async deletePermission(@Param() permissionIdDto: PermissionIdRequestParamsDto) {
    const streamId = permissionIdDto._id;
    return this.permissionsService.deletePermission(streamId, permissionIdDto);
  }

  /* Send Assign Permission Email */
  /*--------------------------------------------*/
  @ApiOperation({ tags: ['Send Assign Permission Email'] })
  @ApiResponse({ status: 200, description: 'Send Assign Permission Email.' })
  @UseGuards(AuthGuard(CONSTANTS.AUTH_JWT), AssignRoleGuard)
  @Post('assign')
  async sendAssignPermissionEmail(@Body() permissionAssignDto: PermissionAssignDto) {
    const streamId = Utils.getUuid();
    return this.permissionsService.sendAssignPermissionEmail(streamId, permissionAssignDto);
  }

  /* Accept permission */
  /*--------------------------------------------*/
  // @ApiOperation({ tags: ['Accept permission'] })
  // @ApiResponse({ status: 200, description: 'Accept permission.' })
  // @UseGuards(AuthGuard(CONSTANTS.AUTH_JWT), AssignRoleGuard)
  // @Post()
  // async acceptPermission(@Body() permissionAssignDto: PermissionAssignDto) {
  //   const streamId = Utils.getUuid();
  //   return this.permissionsService.acceptPermission(streamId, permissionAssignDto);
  // }

  /* List Permissions */

  /*--------------------------------------------*/
  @ApiOperation({ tags: ['List Permissions'] })
  @ApiResponse({ status: 200, description: 'List Permissions.' })
  @Roles([CONSTANTS.ROLE.ADMIN])
  @Get()
  async getPermissions(@Query() getPermissionsQuery: GetPermissionsQuery) {
    return this.permissionsService.getPermissions(getPermissionsQuery);
  }

  /* Find Permission */

  /*--------------------------------------------*/
  // TODO: check permission find permission belong to user
  @ApiOperation({ tags: ['Find Permission'] })
  @ApiResponse({ status: 200, description: 'Find Permission.' })
  @Get(':id')
  async findOnePermission(@Param() findPermissionQuery: FindPermissionQuery) {
    return this.permissionsService.findOne(findPermissionQuery);
  }
}