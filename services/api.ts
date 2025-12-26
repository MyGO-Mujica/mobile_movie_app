/**
 * TMDB API 配置对象
 * 
 * 作用：统一管理 The Movie Database (TMDB) API 的配置信息
 * 
 * - BASE_URL: TMDB API 的基础地址
 * - API_KEY: 从 .env 文件中读取的 API 密钥（用于 Bearer Token 认证）
 * - headers: 请求头配置，包含：
 *   - accept: 指定接收 JSON 格式的响应
 *   - Authorization: Bearer Token 认证，使用 API 密钥进行身份验证
 * 
 * 注意：process.env.EXPO_PUBLIC_MOVEIE_API_KEY 会在构建时从 .env 文件中读取
 * 所有以 EXPO_PUBLIC_ 开头的环境变量在 React Native 客户端代码中都是可访问的
 */
export const TMDB_CONFIG = {
    BASE_URL:'https://api.themoviedb.org/3',
    API_KEY:process.env.EXPO_PUBLIC_MOVEIE_API_KEY,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVEIE_API_KEY}`,
    }
}

/**
 * 获取电影列表的异步函数
 * 
 * @param {string} query - 可选的搜索关键词
 * 
 * 功能说明：
 * 1. 如果提供了 query 参数，则调用搜索 API 查找匹配的电影
 * 2. 如果没有提供 query，则返回按受欢迎程度排序的热门电影列表
 * 
 * API 端点：
 * - 搜索模式: /search/movie?query=关键词
 * - 发现模式: /discover/movie?sort_by=popularity.desc
 * 
 * @returns {Promise<Array>} 返回电影列表数组
 * @throws {Error} 当 API 请求失败时抛出错误
 * 
 * 使用示例：
 * - fetchMovies({query: "阿凡达"}) // 搜索阿凡达相关电影
 * - fetchMovies({query: ""}) // 获取热门电影列表
 */
export const fetchMovies = async({query}:{query:string}) => {
     // 根据是否有搜索词构建不同的 API 端点
     const endpoint = query
    ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
    : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc`;

  // 发送 GET 请求到 TMDB API
  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  // 检查响应状态，如果请求失败则抛出错误
  if (!response.ok) {
    throw new Error(`Failed to fetch movies: ${response.statusText}`);
  }

  // 解析 JSON 响应数据
  const data = await response.json();
  // 返回结果数组（data.results 包含电影列表）
  return data.results;
};

