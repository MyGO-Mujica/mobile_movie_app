/**
 * useFetch - 通用数据获取自定义 Hook
 * 
 * 作用：封装异步数据请求的通用逻辑，自动管理加载状态、错误处理和数据缓存
 * 这是一个可复用的 Hook，可以用于任何需要从 API 获取数据的场景
 * 
 * 使用场景:
 * - 获取电影列表、电影详情等 API 数据
 * - 自动处理加载状态，无需手动管理 loading 状态
 * - 统一的错误处理机制
 * 
 * 
 * @template T - 返回数据的类型（使用 TypeScript 泛型，保证类型安全）
 * @param {() => Promise<T>} fetchFunction - 异步获取数据的函数，必须返回 Promise
 * @param {boolean} autoFetch - 是否在组件挂载时自动获取数据（默认 true）
 * 
 * @returns {Object} 返回包含以下属性的对象：
 *   - data: T | null - 获取到的数据，初始为 null
 *   - loading: boolean - 加载状态，true 表示正在加载
 *   - error: Error | null - 错误对象，如果请求失败会包含错误信息
 *   - refetch: () => Promise<void> - 手动重新获取数据的函数
 *   - reset: () => void - 重置所有状态到初始值的函数
 */

import { useEffect, useState } from "react";

const useFetch = <T>(fetchFunction: () => Promise<T>, autoFetch = true) => {
  // 状态1: 存储从 API 获取到的数据，初始值为 null
  const [data, setData] = useState<T | null>(null);
  
  // 状态2: 加载状态标志，用于显示加载指示器（如 ActivityIndicator）
  const [loading, setLoading] = useState(false);
  
  // 状态3: 错误信息，如果请求失败会存储 Error 对象
  const [error, setError] = useState<Error | null>(null);

  /**
   * fetchData - 执行数据获取的核心函数
   * 
   * 功能流程:
   * 1. 设置 loading = true，显示加载状态
   * 2. 清空之前的错误信息
   * 3. 调用传入的 fetchFunction 获取数据
   * 4. 成功：将数据保存到 state
   * 5. 失败：捕获错误并保存到 error state
   * 6. 最终：无论成功或失败，都设置 loading = false
   */
  const fetchData = async () => {
    try {
      // 步骤1: 开始加载，设置 loading 为 true
      setLoading(true);
      
      // 步骤2: 清空之前的错误（如果有的话）
      setError(null);

      // 步骤3: 调用传入的异步函数获取数据
      const result = await fetchFunction();
      
      // 步骤4: 成功获取数据，保存到 state
      setData(result);
    } catch (err) {
      // 步骤5: 捕获错误并保存
      // 确保错误是 Error 类型，如果不是则包装成 Error 对象
      setError(
        err instanceof Error ? err : new Error("An unknown error occurred")
      );
    } finally {
      // 步骤6: 无论成功或失败，都结束加载状态
      // finally 块总是会执行，确保 loading 被正确重置
      setLoading(false);
    }
  };

  /**
   * reset - 重置所有状态到初始值
   * 
   * 使用场景:
   * - 用户登出时清空数据
   * - 清空搜索结果
   * - 切换到其他页面前清理状态
   */
  const reset = () => {
    setData(null);        // 清空数据
    setError(null);       // 清空错误
    setLoading(false);    // 重置加载状态
  };

  /**
   * useEffect - 组件挂载时的副作用
   * 
   * 如果 autoFetch 为 true（默认值），在组件首次渲染后自动调用 fetchData
   * 依赖数组为空 []，意味着只在组件挂载时执行一次
   * 
   * 注意: 这里依赖数组为空可能会触发 React Hooks 警告
   * 如果 fetchFunction 每次都是新函数，建议使用 useCallback 包裹
   */
  useEffect(() => {
    if (autoFetch) {
      fetchData();  // 自动获取数据
    }
  }, []); // 空依赖数组 = 只在挂载时执行一次

  /**
   * 返回值说明:
   * - data: 获取到的数据（可能是电影列表、电影详情等）
   * - loading: 是否正在加载（用于显示/隐藏加载指示器）
   * - error: 错误对象（用于显示错误提示）
   * - refetch: 重新获取数据的函数（用于下拉刷新、重试等）
   * - reset: 重置状态的函数（用于清空数据）
   */
  return { data, loading, error, refetch: fetchData, reset };
};

export default useFetch;