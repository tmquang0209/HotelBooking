import React, { useState, useEffect } from "react";
import {
    View,
    Image,
    Text,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    RefreshControl,
} from "react-native";
import styles from "../styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import format from "date-fns/format";

export default function Home({ navigation }) {
    const currentDate = new Date();
    const currentHours = currentDate.getHours();
    const [refreshing, setRefreshing] = useState(false);
    const [account, setAccount] = useState();
    const [recentSearch, setRecentSearch] = useState([]);
    const [greeting, setGreeting] = useState();

    const today = new Date();
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const nextTwoDay = new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000);

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
            fetchAccount();
            getRecentViews();
        }, 2000);
    }, []);
    const imageList = [
        {
            locationName: "Da Nang",
            img: "https://cf.bstatic.com/xdata/images/city/600x600/688844.jpg?k=02892d4252c5e4272ca29db5faf12104004f81d13ff9db724371de0c526e1e15&o=",
        },
        {
            locationName: "TP. Ho Chi Minh",
            img: "https://cf.bstatic.com/xdata/images/city/600x600/688893.jpg?k=d32ef7ff94e5d02b90908214fb2476185b62339549a1bd7544612bdac51fda31&o=",
        },
        {
            locationName: "Ha Noi",
            img: "https://cf.bstatic.com/xdata/images/city/600x600/688853.jpg?k=f6427c8fccdf777e4bbc75fcd245e7c66204280181bea23350388c76c57348d1&o=",
        },
        {
            locationName: "Vung Tau",
            img: "https://cf.bstatic.com/xdata/images/city/600x600/688956.jpg?k=fc88c6ab5434042ebe73d94991e011866b18ee486476e475a9ac596c79dce818&o=",
        },
        {
            locationName: "Da Lat",
            img: "https://cf.bstatic.com/xdata/images/city/600x600/688831.jpg?k=7b999c7babe3487598fc4dd89365db2c4778827eac8cb2a47d48505c97959a78&o=",
        },
    ];

    const fetchAccount = async () => {
        const accountData = await AsyncStorage.getItem("Account");
        if (accountData) {
            // Parse the JSON data
            const parsedAccount = JSON.parse(accountData);

            setAccount(parsedAccount);
        }
    };

    const getRecentViews = async () => {
        try {
            const recentViewsJson = await AsyncStorage.getItem("recentViews");
            if (recentViewsJson !== null) {
                const recentViews = JSON.parse(recentViewsJson);
                if (Array.isArray(recentViews)) {
                    setRecentSearch(recentViews);
                }
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách lịch sử xem gần đây: ", error);
        }
    };

    useEffect(() => {
        fetchAccount();
        getRecentViews();

        if (currentHours >= 0 && currentHours < 12) {
            setGreeting("Good morning, ");
        } else if (currentHours >= 12 && currentHours < 18) {
            setGreeting("Good afternoon, ");
        } else {
            setGreeting("Good evening, ");
        }
    }, []);
    console.log("state", account?.full_name);
    const renderImageList = () => {
        return (
            <View style={{ flex: 1, marginTop: 10, flexDirection: "row" }}>
                {imageList.map((val, i) =>
                    i < 2 ? (
                        <View
                            key={val.locationName}
                            style={{
                                paddingBottom: 10,
                                paddingRight: 10,
                                overflow: "hidden",
                            }}
                        >
                            <Image
                                style={{
                                    width:
                                        Dimensions.get("window").width / 2 - 20,
                                    height: 100,
                                    resizeMode: "cover",
                                }}
                                source={{
                                    uri: val.img,
                                }}
                            />
                            <Text
                                style={{
                                    position: "absolute",
                                    fontSize: 10,
                                    color: "#FFFFFF",
                                    paddingLeft: 10,
                                }}
                            >
                                {val.locationName}
                            </Text>
                        </View>
                    ) : null
                )}
            </View>
        );
    };

    const renderImageList2 = () => {
        return (
            <View style={{ marginTop: 10, flexDirection: "row" }}>
                {imageList.map((val, i) =>
                    i >= 2 ? (
                        <View
                            key={val.locationName}
                            style={{
                                paddingBottom: 10,
                                paddingRight: 5,
                            }}
                        >
                            <Image
                                style={{
                                    width:
                                        Dimensions.get("window").width / 4 + 20,
                                    height: 100,
                                    resizeMode: "cover",
                                }}
                                source={{
                                    uri: val.img,
                                }}
                            />
                            <Text
                                style={{
                                    position: "absolute",
                                    fontSize: 10,
                                    color: "#FFFFFF",
                                    paddingLeft: 10,
                                }}
                            >
                                {val.locationName}
                            </Text>
                        </View>
                    ) : null
                )}
            </View>
        );
    };

    // console.log(account);

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: "#FFFFFF" }}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <View style={{ flex: 1 }}>
                <Image
                    style={{ width: "100%", height: 300 }}
                    source={{
                        uri: "https://cdn.vjshop.vn/tin-tuc/5-cach-cai-thien-bo-cuc-anh-phong-canh-thong-qua-phoi-sang-lau/cai-thien-anh-phong-canh-bang-phuong-phap-chup-phoi-sang-lau.jpg",
                    }}
                />
                <View
                    style={{
                        position: "absolute",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        width: "100%",
                        bottom: 20,
                        paddingHorizontal: 10,
                    }}
                >
                    <TouchableOpacity
                        style={{
                            backgroundColor: "#3083e3",
                            padding: 10,
                            alignItems: "center",
                            borderRadius: 20,
                            flex: 1,
                        }}
                        onPress={() => navigation.navigate("Search")}
                    >
                        <Text style={{ color: "white" }}>Search location</Text>
                    </TouchableOpacity>
                </View>
                {/* <View
                    style={{
                        position: "absolute",
                        padding: 10,
                        // backgroundColor: "#FFFFFF",
                    }}
                >
                    <Text style={{ color: "#FFFFFF", fontSize: 20, fontWeight: "600" }}>
                        {account ? greeting + account.full_name : greeting + "guest"}
                    </Text>
                </View> */}
            </View>
            <View
                style={[styles.container, { flex: 1, flexDirection: "column" }]}
            >
                {recentSearch.length ? (
                    <View>
                        <Text
                            style={{
                                fontSize: 15,
                                paddingBottom: 10,
                                fontWeight: "bold",
                            }}
                        >
                            Recent views
                        </Text>
                    </View>
                ) : null}
                <View style={{ flexDirection: "row" }}>
                    <ScrollView horizontal>
                        {recentSearch
                            ? recentSearch.map((val) => (
                                  <TouchableOpacity
                                      style={{ paddingHorizontal: 10 }}
                                      key={val.item.hotel_id}
                                      onPress={() =>
                                          navigation.navigate("Details", {
                                              searchID: val.searchID,
                                              data: {
                                                  ...val.data,
                                                  startDate: format(
                                                      tomorrow,
                                                      "yyyy-MM-dd"
                                                  ),
                                                  endDate: format(
                                                      nextTwoDay,
                                                      "yyyy-MM-dd"
                                                  ),
                                              },
                                              item: val.item,
                                          })
                                      }
                                  >
                                      <View>
                                          <Image
                                              style={{
                                                  width: 100,
                                                  height: 100,
                                              }}
                                              source={{
                                                  uri: val.item.main_photo_url,
                                              }}
                                          />
                                          <Text
                                              style={{
                                                  maxWidth: 100,
                                                  maxHeight: 20,
                                              }}
                                          >
                                              {val.item.hotel_name}
                                          </Text>
                                      </View>
                                  </TouchableOpacity>
                              ))
                            : null}
                    </ScrollView>
                </View>

                {renderImageList()}
                {renderImageList2()}
            </View>
        </ScrollView>
    );
}
