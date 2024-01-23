import { ApiResponse } from "../../node_modules/apisauce/apisauce";
import { api } from "../api/api-config";
import { Stock } from "../model/stock";

export const readAllStocks = async ():  Promise<ApiResponse<Stock>> =>{
     return api.get('/stock/symbol?exchange=US')
}