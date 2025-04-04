// src/middleware.ts
import { defineMiddleware } from "astro/middleware";

export const onRequest = defineMiddleware(async (context, next) => {
    const response = await next();

    // 如果是 404 页面，则重定向到首页
    if (response.status === 404) {
        return new Response(null, {
            status: 302,
            headers: {
                Location: '/', // 重定向到首页
            },
        });
    }

    return response;
});
