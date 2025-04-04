import { loadEnv } from 'vite';
import { getCollection } from 'astro:content';

const { GITHUB_PERSONAL_ACCESS_TOKEN } = loadEnv(process.env.NODE_ENV || 'production', process.cwd(), '');

// 存储中文标签与其hash值的映射关系
const chineseTagsMap = new Map<string, string>();

export const slugify = (input: string) => {
	if (!input) return '';

	// make lower case and trim
	var slug = input.toLowerCase().trim();

	// remove accents from charaters
	slug = slug.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

	// 处理中文字符
	if (/[\u4e00-\u9fa5]/.test(slug)) {
		// 如果包含中文字符，生成唯一hash
		const hash = Array.from(slug).reduce((acc, char) => {
			return acc + char.charCodeAt(0);
		}, 0);
		const cnSlug = `cn-${hash}`;

		// 保存映射关系
		chineseTagsMap.set(cnSlug, input);

		return cnSlug;
	}

	// replace invalid chars with spaces
	slug = slug.replace(/[^a-z0-9\s-]/g, ' ').trim();

	// replace multiple spaces or hyphens with a single hyphen
	slug = slug.replace(/[\s-]+/g, '-');

	return slug;
};

export const unslugify = async (slug: string) => {
	if (slug.startsWith('cn-')) {
		// 先从缓存中查找
		if (chineseTagsMap.has(slug)) {
			return chineseTagsMap.get(slug) as string;
		}

		try {
			// 如果缓存中没有，尝试从所有文章中查找原始标签
			const allPosts = await getCollection('blog');
			for (const post of allPosts) {
				const tags = post.data.tags || [];
				for (const tag of tags) {
					if (tag && typeof tag === 'string') {
						const tagSlug = slugify(tag);
						if (tagSlug === slug) {
							// 找到匹配的标签，保存到缓存
							chineseTagsMap.set(slug, tag);
							return tag;
						}
					}
				}
			}
		} catch (error) {
			console.error('获取标签失败:', error);
		}

		// 如果仍然没有找到，返回一个默认值
		return '标签';
	}

	return slug.replace(/\-/g, ' ').replace(/\w\S*/g, (text) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase());
};

export const kFormatter = (num: number) => {
	return Math.abs(num) > 999 ? (Math.sign(num) * (Math.abs(num) / 1000)).toFixed(1) + 'k' : Math.sign(num) * Math.abs(num);
};

export const getRepositoryDetails = async (repositoryFullname: string) => {
	const repoDetails = await fetch('https://api.github.com/repos/' + repositoryFullname, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${GITHUB_PERSONAL_ACCESS_TOKEN}`,
			'X-GitHub-Api-Version': '2022-11-28'
		}
	});
	const response = await repoDetails.json();
	return response;
};
