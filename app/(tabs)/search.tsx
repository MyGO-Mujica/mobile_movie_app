import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import useFetch from "@/services/useFetch";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";

import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
const Search = () => {
  const [searchQuery, setSearchQuery] = useState(" ");

  const { 
    data: movies, 
     loading,
     error,
    refetch: loadMovies,
    reset,
  } = useFetch(() => fetchMovies({ 
    query: searchQuery 
    //取消自动获取数据
  }), false);

  /**
   * 搜索防抖：等待用户停止输入 500ms 后才发送 API 请求
   * 避免每次输入字符都触发搜索，减少不必要的请求
   */
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim()) {
        await loadMovies(); // 有搜索词：执行搜索
      } else {
        reset(); // 无搜索词：重置状态
      }
    }, 500);
    
    return () => clearTimeout(timeoutId); // 清理定时器
  }, [searchQuery]);

  return (
    <View className="flex-1 bg-primary">
        <Image source={images.bg} className="flex-1 absolute w-full z-0" resizeMode="cover"></Image>
           <FlatList
        className="px-5"
        data={movies as Movie[]}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <MovieCard {...item} />}
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "flex-start",
          gap: 16,
          marginVertical: 16,
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
       ListHeaderComponent={
          <>
            <View className="w-full flex-row justify-center mt-20 items-center">
              <Image source={icons.logo} className="w-12 h-10" />
            </View>

            <View className="my-5">
              <SearchBar
                placeholder="什么都搜不到"
                value={searchQuery}
                onChangeText={(text: string) => setSearchQuery(text)}
              />
            </View>

            {loading && (
              <ActivityIndicator
                size="large"
                color="#0000ff"
                className="my-3"
              />
            )}

            {error && (
              <Text className="text-red-500 px-5 my-3">
                Error: {error.message}
              </Text>
            )}

            {!loading &&
              !error &&
             searchQuery.trim() &&
              movies?.length! > 0 && (
                <Text className="text-xl text-white font-bold">
                 搜索结果为{" "}
                  <Text className="text-accent">{searchQuery}</Text>
                </Text>
              )}
          </>
         }
           ListEmptyComponent={
          !loading && !error ? (
            <View className="mt-10 px-5">
              <Text className="text-center text-gray-500">
                {searchQuery.trim()
                  ? "搜不到任何电影"
                  : "输入关键字搜索电影"}
              </Text>
            </View>
          ) : null
        }
        />
    </View>
  )
}

export default Search