export default function mergeStyles(style1: string, style2: string | any): string {

    if (style1 === undefined) { // If the base component does not have styles defined

        return `
${style2}
    `.trim();
    }
    else {

        return `
${style1}

${style2}
    `.trim();
    }
}