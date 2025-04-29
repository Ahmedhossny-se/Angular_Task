import { IProduct } from "./IProduct";

export class ApiResponce {
    products: IProduct[];
    total: number;
    skip: number;
    limit: number;
}
