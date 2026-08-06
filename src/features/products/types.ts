import type { LucideIcon } from "lucide-react"

export type productT = {
  id?: number;
  name: string;
  price: string | number ;
  importance: "High" | "Medium" | "Low" ;
  category: string;
  purchaseDate: string;
  durationMonths: number;
  receipt?: string;
}


export type productsInStateT = {

    products : productT[];

}


export type importanceT = {

    High : string ;

    Medium : string ;

    Low : string

}


export type categoriesClssificationT = {

    value : string ;

    label : string ;

    icon : LucideIcon    

}