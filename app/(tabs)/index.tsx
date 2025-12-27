import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import TrendingCard from "@/components/TrendingCard";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import { getTrendingMovies } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { useRouter } from "expo-router";
import { ActivityIndicator, FlatList, Image, ScrollView, Text, View } from "react-native";
export default function Index() {
  const router = useRouter(); 

  const{
    data: trendingMovies,
    loading: trendingLoading,
    error: trendingError
  } = useFetch(getTrendingMovies)

  const { 
    data :movies, 
    loading: moviesLoading, 
    error: moviesError } = useFetch(() => fetchMovies(
      { query: "" }));

  return (
    <View className="flex-1 bg-primary">
          <Image
        source={images.bg}
        className="absolute w-full z-0"
       
      />

        <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
      >
           <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />

          {moviesLoading || trendingLoading ? (
             <ActivityIndicator 
                size='large'
                color="#0000ff"
                className="mt-10 self-center"
             />
          ): moviesError || trendingError ? (
              <Text>Error: {moviesError?.message || trendingError?.message}</Text>
            ):(
                <View className="flex-1 mt-5">
                    <SearchBar 
                        onPress={() => router.push("/search")}
                        placeholder="对不起，什么都搜不到"
               />
               {trendingMovies && (
              <View className="mt-10">
                <Text className="text-lg text-white font-bold mb-3">
                  猜你喜欢
                </Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  ItemSeparatorComponent={() => <View className="w-4" />}
                  className="mb-4 mt-3"
                  data={trendingMovies}
                  contentContainerStyle={{
                    gap: 26,
                  }}
                  renderItem={({ item, index }) => (
                   <TrendingCard movie={item} index={index} />
                  )}
                  keyExtractor={(item) => item.$id}
                 
                />
              </View>
            )}
               <>
                 <Text className="text-lg text-white font-bold mt-5 mb-3">
                    最新电影
                 </Text>

                 {/* FlatList: React Native 的高性能列表组件，使用虚拟化技术只渲染可见项 */}
                 <FlatList
                    // data: 要渲染的数据数组（电影列表）
                    data={movies}
                    // renderItem: 定义如何渲染每一项，item 是数组中的单个电影对象
                    renderItem={({ item }) =>(
                        <MovieCard 
                            {...item}
                        />
                    )}
                    // keyExtractor: 为每一项生成唯一的 key，用于优化渲染性能
                    keyExtractor={(item) => item.id.toString()}
                    // numColumns: 设置列数为 3，创建网格布局（类似相册）
                    numColumns={3}
                    //columnWrapperStyle: 当 numColumns > 1 时，设置每一行的样式
                    columnWrapperStyle={{
                      justifyContent: "flex-start",  
                      gap: 20,                      
                      paddingRight: 5,               
                      marginBottom: 10,             
                    }}
                    className="mt-2 pb-32"
                    scrollEnabled={false}
                 />
               </>
           </View>
            )}

      </ScrollView>
    </View>
  );
}
