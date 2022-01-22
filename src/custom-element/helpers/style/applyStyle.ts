interface Rule {

    key: string;

    value: string;
}

export default function applyStyle(strings: TemplateStringsArray, ...values: any): Function {

    const rules: Rule[] = [];

    const length = strings.length;

    for (let i = 0; i < length; ++i) {

        const s = strings[i].trim();

        addRules(rules, s);

        if (s.endsWith(':')) { // Complete the last rule with the value 

            const lastRule = rules[rules.length - 1];

            lastRule.value = values[i];
        }
    }

    return component => {

        rules.forEach(rule => component.style[rule.key] = rule.value);
    };
}

function addRules(rules: Rule[], s: string) {

    const rulesText = s.trim().split(';');

    rulesText
        .filter(r => r !== '') // Remove empty entries
        .forEach(r => {

            const parts = r.split(":");

            rules.push({
                key: cssToJs(parts[0].trim()),
                value: parts[1].trim()
            });
        });
}

/**
 * Converts from css rule key (e.g. "background-color") to javascript property key (e.g. "background-color")
 * @param s 
 * @returns 
 */
const cssToJs: (string) => string = s => s.replace(/\W+\w/g, match => match.slice(-1).toUpperCase());
