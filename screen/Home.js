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
import axios from "axios";
import { Rating } from "react-native-elements";

export default function Home({ navigation }) {
    const currentDate = new Date();
    const currentHours = currentDate.getHours();
    const [refreshing, setRefreshing] = useState(false);
    const [account, setAccount] = useState();
    const [recentSearch, setRecentSearch] = useState([]);
    const [greeting, setGreeting] = useState();
    const [suggest, setSuggest] = useState([]);

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

    const fetchAccount = async () => {
        const accountData = await AsyncStorage.getItem("Account");
        if (accountData) {
            // Parse the JSON data
            const parsedAccount = JSON.parse(accountData);

            setAccount(parsedAccount);
        }
    };

    const fetchSuggest = async () => {
        try {
            const response = await axios.request({
                url: "https://api.toluu.site/post/auto-complete.php?suggest",
            });
            const responseData = response.data;
            setSuggest(responseData.result);
        } catch (err) {
            console.error(err);
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
        fetchSuggest();

        if (currentHours >= 0 && currentHours < 12) {
            setGreeting("Good morning, ");
        } else if (currentHours >= 12 && currentHours < 18) {
            setGreeting("Good afternoon, ");
        } else {
            setGreeting("Good evening, ");
        }
    }, []);

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
                <View
                    style={{
                        position: "absolute",
                        padding: 10,
                        // backgroundColor: "#FFFFFF",
                    }}
                >
                    <Text
                        style={{
                            color: "#FFFFFF",
                            fontSize: 15,
                            fontWeight: "600",
                        }}
                    >
                        {account
                            ? greeting + account.full_name
                            : greeting + "guest"}
                    </Text>
                </View>
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
                                                  uri:
                                                      val.item.main_photo ||
                                                      val.item.main_photo_url,
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

                <View>
                    <Text
                        style={{
                            fontSize: 15,
                            paddingBottom: 10,
                            fontWeight: "bold",
                        }}
                    >
                        Recommended location
                    </Text>
                    {suggest.map((el, i) => (
                        <View
                            style={{
                                marginTop: i != 0 ? 10 : 0,
                            }}
                            key={i}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate("ListRooms", {
                                        location: el,
                                        startDate: format(today, "yyyy-MM-dd"),
                                        endDate: format(tomorrow, "yyyy-MM-dd"),
                                        numOfPeople: 1,
                                        numOfRoom: 1,
                                    });
                                    1;
                                }}
                            >
                                <Image
                                    style={{
                                        width:
                                            Dimensions.get("screen").width - 20,
                                        height: 300,
                                    }}
                                    source={{
                                        uri: el.image_url,
                                    }}
                                />
                                <Text
                                    style={{
                                        position: "absolute",
                                        fontSize: 15,
                                        color: "#FFFFFF",
                                        paddingLeft: 10,
                                    }}
                                >
                                    {el.city_name}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}
