import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Image,
    FlatList,
    Dimensions,
    TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";
import styles from "../styles";

import { API_KEY, API_HOST } from "@env";

const screenWidth = Dimensions.get("window").width;

const EllipsisText = ({ text, maxWords }) => {
    const words = text.split(" ");

    const displayText = words.slice(0, maxWords).join(" ");
    const isOverflowing = words.length > maxWords;

    return (
        <View style={{ maxWidth: screenWidth }}>
            <Text>
                {displayText}
                {isOverflowing ? "..." : ""}
            </Text>
        </View>
    );
};

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

const handleRoomPress = (searchID, data, item, navigation) => {
    // Navigate to the desired screen using the 'navigation' object
    navigation.navigate("Details", {
        searchID,
        data,
        item,
    });
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
                        <TouchableOpacity
                            onPress={() =>
                                handleRoomPress(
                                    searchID,
                                    {
                                        startDate: route.params.startDate,
                                        endDate: route.params.endDate,
                                        numOfRoom: route.params.numOfRoom,
                                        numOfPeople: route.params.numOfPeople,
                                    },
                                    item,
                                    navigation
                                )
                            }
                        >
                            <View style={styles.roomContainer}>
                                <Image
                                    style={styles.roomImage}
                                    source={{
                                        uri: item.main_photo_url,
                                    }}
                                />

                                <View style={styles.roomDetails}>
                                    <EllipsisText
                                        text={item.hotel_name}
                                        maxWords={4}
                                    />
                                    <View style={styles.starContainer}>
                                        {Array.from({ length: item.class }).map(
                                            (_, index) => (
                                                <Ionicons
                                                    key={index}
                                                    name="star"
                                                    color="#FFDF00"
                                                    size={20}
                                                />
                                            )
                                        )}
                                    </View>
                                    <EllipsisText
                                        text={
                                            item.district +
                                            (item.district ? ", " : "") +
                                            item.city
                                        }
                                        maxWords={4}
                                    />
                                    <Text style={styles.priceText}>
                                        {item.min_total_price.toLocaleString(
                                            "en-US"
                                        )}{" "}
                                        {item.currency_code}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            )}
        </View>
    );
}
