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
const base_entity_dto_1 = require("base/base-entity.dto");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
let RequestDto = class RequestDto extends base_entity_dto_1.BaseEntityDto {
    constructor(tokenId, host, duration, mimeType) {
        super();
        this.tokenId = tokenId;
        this.host = host;
        this.duration = duration;
        this.mimeType = mimeType;
    }
};
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    typeorm_1.Column(),
    __metadata("design:type", String)
], RequestDto.prototype, "tokenId", void 0);
__decorate([
    class_validator_1.IsIP(),
    class_validator_1.IsString(),
    typeorm_1.Column(),
    __metadata("design:type", String)
], RequestDto.prototype, "host", void 0);
__decorate([
    class_validator_1.IsNumber(),
    class_validator_1.IsPositive(),
    typeorm_1.Column({
        comment: 'length of voice - minute',
        type: 'double'
    }),
    __metadata("design:type", Number)
], RequestDto.prototype, "duration", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsNotEmpty(),
    typeorm_1.Column(),
    __metadata("design:type", Object)
], RequestDto.prototype, "mimeType", void 0);
RequestDto = __decorate([
    typeorm_1.Entity('requests'),
    __metadata("design:paramtypes", [String, String, Number, String])
], RequestDto);
exports.RequestDto = RequestDto;
//# sourceMappingURL=requests.dto.js.map