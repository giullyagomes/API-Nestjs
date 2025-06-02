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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const role_enum_1 = require("../enums/role.enum");
const cart_entity_1 = require("../../cart/entities/cart.entity");
const order_entity_1 = require("../../orders/entities/order.entity");
let User = class User {
};
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique user identifier' }),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User email' }),
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User full name' }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User password', writeOnly: true }),
    (0, typeorm_1.Column)(),
    (0, class_transformer_1.Exclude)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User role', enum: role_enum_1.Role, default: role_enum_1.Role.USER }),
    (0, typeorm_1.Column)({ type: 'simple-enum', enum: role_enum_1.Role, default: role_enum_1.Role.USER }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User cart', type: () => cart_entity_1.Cart }),
    (0, typeorm_1.OneToMany)(() => cart_entity_1.Cart, cart => cart.user),
    __metadata("design:type", Array)
], User.prototype, "cart", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User orders', type: () => order_entity_1.Order }),
    (0, typeorm_1.OneToMany)(() => order_entity_1.Order, order => order.user),
    __metadata("design:type", Array)
], User.prototype, "orders", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User creation date' }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User last update date' }),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
User = __decorate([
    (0, typeorm_1.Entity)('users')
], User);
exports.User = User;
//# sourceMappingURL=user.entity.js.map