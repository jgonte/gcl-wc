import applyStyle from "./applyStyle";

describe("applyStyle tests", () => {

    it('should apply a literal style single rule', async () => {

        const element = document.createElement('div');

        applyStyle`
            color: red;
        `(element);

        expect(element.style.color).toEqual('red');
    });

    it('should apply a literal style more than one rule', async () => {

        const element = document.createElement('div');

        applyStyle`
            color: red;
            background-color: yellow;
        `(element);

        expect(element.style.color).toEqual('red');

        expect(element.style.backgroundColor).toEqual('yellow');
    });

    it('should apply a style one value rule and one literal', async () => {

        const element = document.createElement('div');

        const red = 'red';

        applyStyle`
            color: ${red};
            background-color: yellow;
        `(element);

        expect(element.style.color).toEqual('red');

        expect(element.style.backgroundColor).toEqual('yellow');
    });

    it('should apply a style one literal and one value rule ', async () => {

        const element = document.createElement('div');

        const red = 'red';

        applyStyle`   
            background-color: yellow;
            color: ${red};
        `(element);

        expect(element.style.color).toEqual('red');

        expect(element.style.backgroundColor).toEqual('yellow');
    });

    it('should apply a combination of rules ', async () => {

        const element = document.createElement('div');

        const fontSize = '12px'

        const red = 'red';

        applyStyle`
            font-size: ${fontSize};   
            background-color: yellow;
            color: ${red};
            text-align: center;
        `(element);

        expect(element.style.textAlign).toEqual('center');

        expect(element.style.color).toEqual('red');

        expect(element.style.backgroundColor).toEqual('yellow');

        expect(element.style.fontSize).toEqual('12px');
    });

});