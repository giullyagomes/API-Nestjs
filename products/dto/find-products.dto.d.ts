import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class FindProductsDto extends PaginationDto {
    name?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
}
