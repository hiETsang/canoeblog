import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

export async function GET(context) {
	const posts = await getCollection('blog');

	// ✅ 按照发布时间从新到旧排序
	const sortedPosts = posts.sort(
		(a, b) => new Date(b.data.pubDate) - new Date(a.data.pubDate)
	);

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: sortedPosts.map((post) => ({
			...post.data,
			link: `/${post.slug}/`,
		})),
	});
}
