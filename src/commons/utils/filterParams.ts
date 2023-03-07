export function filterParams(origin: object, picks: string[]) {
    let query = {};
    for (let i = 0; i < picks.length; i++) {
        const key = picks[i];
        const element = origin[key];

        if (element) {
            query[key] = element;
        }
    }

    return query;
}
