import type { LayoutServerLoad } from './$types';

export const load = (async ({ params }) => {
    const { gameId } = params;
    return { gameId };
}) satisfies LayoutServerLoad;