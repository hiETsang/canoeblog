import { loadEnv } from 'vite';

const { GITHUB_PERSONAL_ACCESS_TOKEN } = loadEnv(process.env.NODE_ENV || 'production', process.cwd(), '');

export const slugify = (input: string) => {
	if (!input) return '';

	// make lower case and trim
	var slug = input.toLowerCase().trim();

	// remove accents from charaters
	slug = slug.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

	// 处理中文字符
	if (/[\u4e00-\u9fa5]/.test(slug)) {
		// 如果包含中文字符，使用拼音或其他处理方法
		// 这里简单地用拼音首字母或随机字符代替
		// 实际项目中可能需要更复杂的拼音转换库
		const hash = Array.from(slug).reduce((acc, char) => {
			return acc + char.charCodeAt(0);
		}, 0);
		return `cn-${hash}`;
	}

	// replace invalid chars with spaces
	slug = slug.replace(/[^a-z0-9\s-]/g, ' ').trim();

	// replace multiple spaces or hyphens with a single hyphen
	slug = slug.replace(/[\s-]+/g, '-');

	return slug;
};

export const unslugify = (slug: string) => {
	if (slug.startsWith('cn-')) {
		return '中文标签'; // 实际应用中可能需要存储原始标签名称的映射
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
