import { IsNotEmpty } from "class-validator";

export class SchoolDto{

    @IsNotEmpty({message:"Distrito inválido"})
    district:string;

    @IsNotEmpty({message:"Provincia inválida"})
    province:string;

    @IsNotEmpty({message:"Nombre inválido"})
    name:string;

    @IsNotEmpty({message:"Insignia inválida"})
    insigne:string;
}