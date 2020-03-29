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
var TokenTypeDto_1;
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const base_entity_dto_1 = require("base/base-entity.dto");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const constant_1 = require("common/constant");
let TokenTypeDto = TokenTypeDto_1 = class TokenTypeDto extends base_entity_dto_1.BaseEntityDto {
    constructor(name, minutes, price, salePercent = 0) {
        super();
        this.name = name;
        this.minutes = minutes;
        this.price = price;
        this.salePercent = salePercent;
    }
};
TokenTypeDto.createTempInstance = () => {
    return new TokenTypeDto_1('', 0, 0, 0);
};
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    class_validator_1.IsIn([
        constant_1.CONSTANTS.TOKEN_TYPE.FREE,
        constant_1.CONSTANTS.TOKEN_TYPE['50-MINS'],
        constant_1.CONSTANTS.TOKEN_TYPE['200-MINS'],
        constant_1.CONSTANTS.TOKEN_TYPE['500-MINS'],
    ]),
    typeorm_1.Column(),
    __metadata("design:type", String)
], TokenTypeDto.prototype, "name", void 0);
__decorate([
    class_transformer_1.Type(() => Number),
    class_validator_1.IsNumber(),
    class_validator_1.IsPositive(),
    typeorm_1.Column(),
    __metadata("design:type", Number)
], TokenTypeDto.prototype, "minutes", void 0);
__decorate([
    class_transformer_1.Type(() => Number),
    class_validator_1.IsNumber(),
    class_validator_1.IsPositive(),
    typeorm_1.Column(),
    __metadata("design:type", Number)
], TokenTypeDto.prototype, "price", void 0);
__decorate([
    class_transformer_1.Type(() => Number),
    class_validator_1.IsNumber(),
    class_validator_1.IsPositive(),
    typeorm_1.Column({
        default: 0,
    }),
    __metadata("design:type", Number)
], TokenTypeDto.prototype, "salePercent", void 0);
TokenTypeDto = TokenTypeDto_1 = __decorate([
    typeorm_1.Entity('token_types'),
    __metadata("design:paramtypes", [String, Number, Number, Number])
], TokenTypeDto);
exports.TokenTypeDto = TokenTypeDto;
//# sourceMappingURL=token-types.dto.js.map