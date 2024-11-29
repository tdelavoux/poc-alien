export class RollService{

    static getDicesFromRoll(roll){

        // TCerains rolls ont un un opérateurs dans leurs termes. A voir si il y a des cas autre que '+' pour les gérer
        let successDices = 0;
        let stressDices  = 0;

        roll?.terms.forEach((term, i) => {
            if (Array.isArray(term?.results)) {
                successDices += term.results.filter(d => d.result === 6).length;
                stressDices  += (i !== 0) ? term.results.filter(d => d.result === 1).length: 0;
            }
        });

        return {
            success: successDices,
            stress: stressDices,
        };
    }

}