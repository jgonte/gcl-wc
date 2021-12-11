export default function mergeStyles(style1: string, style2: string | any): string {

    return `
${style1}

${style2}
    `.trim();
}