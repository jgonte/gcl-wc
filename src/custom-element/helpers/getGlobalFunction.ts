export default function getGlobalFunction(value: string): Function {

    const functionName = value.replace('()', '').trim();

    return (window as any)[functionName];
}