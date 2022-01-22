import applyStyle from "./applyStyle";

describe("applyStyle tests", () => {

    it('should apply a literal style single rule', async () => {

        const component = document.createElement('div');

        applyStyle`
            color: red;
        `(component);

        expect(component.style.color).toEqual('red');
    });

    it('should apply a literal style more than one rule', async () => {

        const component = document.createElement('div');

        applyStyle`
            color: red;
            background-color: yellow;
        `(component);

        expect(component.style.color).toEqual('red');

        expect(component.style.backgroundColor).toEqual('yellow');
    });

    it('should apply a style one value rule and one literal', async () => {

        const component = document.createElement('div');

        const red = 'red';

        applyStyle`
            color: ${red};
            background-color: yellow;
        `(component);

        expect(component.style.color).toEqual('red');

        expect(component.style.backgroundColor).toEqual('yellow');
    });

    it('should apply a style one literal and one value rule ', async () => {

        const component = document.createElement('div');

        const red = 'red';

        applyStyle`   
            background-color: yellow;
            color: ${red};
        `(component);

        expect(component.style.color).toEqual('red');

        expect(component.style.backgroundColor).toEqual('yellow');
    });

    it('should apply a combination of rules ', async () => {

        const component = document.createElement('div');

        const fontSize = '12px'

        const red = 'red';

        applyStyle`
            font-size: ${fontSize};   
            background-color: yellow;
            color: ${red};
            text-align: center;
        `(component);

        expect(component.style.textAlign).toEqual('center');

        expect(component.style.color).toEqual('red');

        expect(component.style.backgroundColor).toEqual('yellow');

        expect(component.style.fontSize).toEqual('12px');
    });

});