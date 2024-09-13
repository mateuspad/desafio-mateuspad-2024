import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const animais = path.join(__dirname, 'data', 'animais.json');
const recintos = path.join(__dirname, 'data', 'recintos.json');

const animaisData = JSON.parse(fs.readFileSync(animais, 'utf8'));
const recintosData = JSON.parse(fs.readFileSync(recintos, 'utf8'))


class RecintosZoo {
    constructor(){
        this.recintos=recintosData;
        this.animais=animaisData;

    }

    analisaRecintos(animalNome, quantidade) {
        const animal = animalNome.toUpperCase();

        if(!this.animais[animal]){
            return {
                erro: "Animal inválido"
            }
        }
        if (isNaN(quantidade)||quantidade<=0){
            return {
                erro: "Quantidade inválida"
            }
        }

        const infoAnimal = this.animais[animal]
        const biomaAnimal = infoAnimal.bioma
        const tamanhoAnimal = infoAnimal.tamanho

        const recintosViaveis = [];

        for(const recinto of this.recintos){
            if(this.podeAcomodarRecinto(recinto, tipoAnimal, quantidade, tamanhoAnimal, biomaAnimal)){
                const espacoLivre = recinto.tamanhoTotal - this.calculaEspacoOcupado(recinto, tamanhoAnimal, quantidade);
                recintosViaveis.push(`Recinto ${recinto.numero}(espaço livre: ${espacoLivre} total: ${recinto.tamanhoTotal})`)
            }
        }

        if(recintosViaveis.length===0){
            return{
                erro:"Não há recinto viável"
            };
        }

        return{recintosViaveis: recintosViaveis.sort()};
    }

    podeAcomodarRecinto(recinto, tipoAnimal, quantidade, tamanhoAnimal, biomaAnimal){
        if(!this.biomaCompativel(recinto,biomaAnimal)){
            return false;
        }

        const espacoOcupado = this.calculaEspacoOcupado(recinto, tipoAnimal, quantidade, tamanhoAnimal);

        if(this.temOutroAnimal(recinto,tipoAnimal)&& quantidade>1){
            if(recinto.animais[tipoAnimal]){
                return espacoOcupado <= recinto.tamanhoTotal;
            }
            return espacoOcupado <= recinto.tamanhoTotal;
        }

        return espacoOcupado <=recinto.tamanhoTotal
    }

    biomaCompativel(recinto, biomaAnimal){
        if(biomaAnimal === "savana ou floresta" && recinto.bioma === "floresta"){
            return true;
        }
        if(biomaAnimal === "savana ou rio" && recinto.bioma === "savana e rio"){
            return true;
        }
        return false;
    }

    temOutroAnimal(recinto, tipoAnimal){
        return Object.keys(recinto.animais).length > 0 && tipoAnimal !== 'macaco';
    }

    calculaEspacoOcupado(recinto, tipoAnimal, quantidade, tamanhoAnimal){
        const ocupacaoExistente = Object.keys(recinto.animais).reduce((acc,key)=>acc+(this.animais[key].tamanho * recinto.animais[key]),0);
        return ocupacaoExistente + (quantidade*tamanhoAnimal);
    }
}

export { RecintosZoo as RecintosZoo };