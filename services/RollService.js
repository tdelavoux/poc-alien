export class RollService{

    static getDicesFromRoll(roll){

        // TODO voir si l'opérateur est toujours un +. 
        let successDices = 0;
        let stressDices = 0;

        roll?.terms.forEach((term, i) => {
            if (Array.isArray(term?.results)) {
                successDices += term.results.filter(d => d.result === 6).length;
                stressDices  += i !== 0 ? term.results.filter(d => d.result === 1).length: 0;
            }
        });

        return {
            success: successDices,
            stress: stressDices,
        };
    }

}