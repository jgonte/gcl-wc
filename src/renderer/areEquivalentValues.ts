export default function areEquivalentValues(v1: any = null, v2: any = null): boolean {

    if (v1 === v2) {

        return true;
    }

    const {
        patcher: patcher1,
        values: values1
    } = v1 || {};

    const {
        patcher: patcher2,
        values: values2
    } = v2 || {};

    if (patcher1 !== undefined &&
        patcher2 !== undefined) {

        if (patcher1 === patcher2) {

            return areEquivalentValues(values1, values2);
        }
        else {

            return false;
        }
    }

    if (Array.isArray(v1) &&
        Array.isArray(v2)) {

        if (v1.length !== v2.length) {

            return false;
        }
        else {

            for (let i = 0; i < v1.length; ++i) {

                if (!areEquivalentValues(v1[i], v2[i])) {

                    return false;
                }
            }

            return true;
        }
    }

}