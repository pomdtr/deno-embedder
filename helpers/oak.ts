/** 
 * Helper methods to easily serve embedded static files from Oak.
 * 
 * @module
 */
import type * as oak from "../deps/oak.ts";
export * as oak from "../deps/oak.ts";
import { lookup } from "../deps/std/media_types.ts";
import type { File, Embeds } from "../embed.ts"
/**
 * Re-exported `oak` so you can depend on it to make sure you use the same version.
 * 
 * If you prefer another version, you may use an import map to rewrite the
 * version used here. (But beware that if Oak changes interfaces, things may break!)
 */


/**
 * Add an entry to `router` to serve static files.
 * 
 * Ex: `serveDir(router, "/static/", staticFiles)`
 */
export function serveDir<T extends Record<string,File>>(router: oak.Router, urlPath: string, embeds: Embeds<T>) {
    if (!urlPath.endsWith("/")) {
        throw new Error(`URL Path must end with "/":  ${urlPath}`)
    }

    let routePath = `${urlPath}:pathPart(.*)`
    router.get(routePath, async (ctx, next) => {
        let filePath = ctx.params.pathPart
        if (filePath === undefined) {
            throw new Error("Expected to find pathPart, but was undefined")
        }
        await serveFile(ctx, embeds, filePath, next)
    })
}

/**
 * Serve a single file from a directory, with the correct mime type.
 * 
 * Ex: `serveFile(ctx, staticFiles.dir, "foo/bar.txt")`
 */
export async function serveFile<T extends Record<string,File>>(
    ctx: oak.Context,
    embeds: Embeds<T>,
    filePath: string,
    next?: () => Promise<unknown>,
): Promise<unknown> {
    let file = await embeds.get(filePath)
    if (!file) {
        if (next) {
            return next()
        }
        return // 404
    }

    let mimeType = lookup(filePath)
    if (mimeType) {
        ctx.response.headers.set("Content-Type", mimeType)
    }
    ctx.response.body = await file.bytes()
}