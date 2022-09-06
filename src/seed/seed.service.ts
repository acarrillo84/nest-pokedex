import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeResponse } from './interfaces/poke-response.interface';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {

  // private readonly axios: AxiosInstance = axios;

  constructor(
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>,

    private readonly http: AxiosAdapter,
  ) {}
  
  /*
  * 2 Formas de insertar pokemon en la base de datos
  * Es para tenerlo de referencia, abajo hare otra funcion mas optimizada
  */ 
  // async executeSeed() {

  //   await this.pokemonModel.deleteMany({}); // delete * from pokemon;

  //   const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=10');
    
  //   const inserPromisesArray = [];

  //   // 01 - Forma de insertarlos uno a uno
  //   // data.results.forEach(async({ name, url }) => {
  //   //   const segments = url.split('/');
  //   //   const no = +segments[ segments.length - 2 ];

  //   //   const pokemon = await this.pokemonModel.create({ name, no });
  //   // });

  //   // 02 - Forma de insercion multiple
  //   data.results.forEach(({ name, url }) => {
  //     const segments = url.split('/');
  //     const no = +segments[ segments.length - 2 ];

  //     // Aqui estamos llenando un array de promesas, notese que,
  //     // en ningun momento se esta ejecutando la promesa, solo llenando el array
  //     inserPromisesArray.push( 
  //       this.pokemonModel.create({ name, no }) 
  //     );
  //   });

  //   await Promise.all( inserPromisesArray );
    
  //   return 'Seed Executed';
  // }



  async executeSeed() {

    await this.pokemonModel.deleteMany({}); // delete * from pokemon;

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');
    
    const pokemonToInsert: { name: string, no: number }[] = [];

    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');
      const no = +segments[ segments.length - 2 ];

      pokemonToInsert.push({ name, no });
    });

    this.pokemonModel.insertMany( pokemonToInsert );
    
    return 'Seed Executed';
  }
}
