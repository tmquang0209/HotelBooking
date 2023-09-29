import React, { useState, useEffect } from "react";
import { View, Text, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../styles";
import RoomListItem from "./RoomListItem";

import { API_KEY, API_HOST } from "@env";

const searchRooms = async (
    location,
    startDate,
    endDate,
    numOfRoom,
    numOfPeople
) => {
    console.log(API_KEY, API_HOST);
    const options = {
        method: "GET",
        url: "https://apidojo-booking-v1.p.rapidapi.com/properties/list",
        params: {
            offset: "0",
            arrival_date: startDate,
            departure_date: endDate,
            guest_qty: numOfRoom,
            dest_ids: location.city_ufi || location.dest_id,
            room_qty: numOfPeople,
            search_type: location.dest_type,
            order_by: "popularity",
            languagecode: "en-us",
        },
        headers: {
            "X-RapidAPI-Key": API_KEY,
            "X-RapidAPI-Host": API_HOST,
        },
    };

    try {
        const response = await axios.request(options);
        console.log("res: ", response.data.search_id);
        return response.data; // Return the autocomplete suggestions
    } catch (error) {
        console.error(error);
        return []; // Return an empty array in case of an error
    }
};

const getRecentViews = async () => {
    try {
        const recentViewsJson = await AsyncStorage.getItem("recentViews");
        if (recentViewsJson !== null) {
            return JSON.parse(recentViewsJson);
        } else {
            return [];
        }
    } catch (error) {
        console.error("Lỗi khi lấy danh sách lịch sử xem gần đây: ", error);
        return [];
    }
};

const addToRecentViews = async (hotel) => {
    try {
        const recentViews = await getRecentViews();

        const index = recentViews.findIndex(
            (item) => item.item.hotel_id === hotel.item.hotel_id
        );

        if (index === -1) {
            recentViews.unshift(hotel);

            const maxLength = 10;
            if (recentViews.length > maxLength) {
                recentViews.pop();
            }

            await AsyncStorage.setItem(
                "recentViews",
                JSON.stringify(recentViews)
            );
        }
    } catch (error) {
        console.error("Lỗi khi thêm vào lịch sử xem gần đây: ", error);
    }
};

const handleRoomPress = async (searchID, data, item, navigation) => {
    const hotel = { searchID, data, item };
    addToRecentViews(hotel);
    // Navigate to the desired screen using the 'navigation' object
    navigation.navigate("Details", {
        searchID,
        data,
        item,
    });
    // navigation.navigate("Dashboard");
    console.log(`Selected hotel ID: ${item.hotel_id}`);
};

export default function ListRooms({ route }) {
    const [location, setLocation] = useState(route.params.location);
    const [listRooms, setListRooms] = useState([]);
    const [searchID, setSearchID] = useState(null);
    const navigation = useNavigation();

    const fetchRooms = async () => {
        try {
            const roomData = await searchRooms(
                location,
                route.params.startDate,
                route.params.endDate,
                route.params.numOfRoom,
                route.params.numOfPeople
            );
            setListRooms(roomData.result);
            setSearchID(roomData.search_id);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchRooms();
        // Set the screen title to the location
        if (location) {
            navigation.setOptions({
                title: route.params.location.city_name,
            });
        }
    }, []);

    console.log(listRooms);
    return (
        <View style={styles.container}>
            {listRooms?.zero_results_message ? (
                <View>
                    <Text>{listRooms?.zero_results_message.title}</Text>
                </View>
            ) : (
                <FlatList
                    data={listRooms}
                    renderItem={({ item }) => (
                        <RoomListItem
                            item={item}
                            handleRoomPress={handleRoomPress}
                            searchID={searchID}
                            navigation={navigation}
                            route={route}
                        />
                    )}
                />
            )}
        </View>
    );
}
