import { IsPositive, IsString, Min, MinLength } from "class-validator";


export class CreatePokemonDto {

    // isInt, isPositivo, min 1
    @IsPositive()
    @Min(1)
    no: number;

    // isString, MinLength 1    
    @IsString()
    @MinLength(1)
    name: string
}
