import React, { useState, useEffect, useRef, useMemo } from "react";
import {
    View,
    Text,
    FlatList,
    DrawerLayoutAndroid,
    TextInput,
    TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../styles";
import RoomListItem from "./RoomListItem";
import RadioGroup from "react-native-radio-buttons-group";

const searchRooms = async (
    location,
    startDate,
    endDate,
    numOfRoom,
    numOfPeople
) => {
    const options = {
        method: "GET",
        url: "https://api.toluu.site/post/getRooms.php?list",
        params: {
            location_id: location.id,
            arrival_date: startDate,
            departure_date: endDate,
            guest_qty: numOfRoom,
            room_qty: numOfPeople,
        },
    };

    try {
        const response = await axios.request(options);
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
    // console.log(`Selected hotel ID: ${item.hotel_id}`);
};

export default function ListRooms({ route }) {
    const [location, setLocation] = useState(route.params.location);
    const [listRooms, setListRooms] = useState([]);
    const [searchID, setSearchID] = useState(null);
    const navigation = useNavigation();
    const draw = useRef(null);
    const [drawPosition, setDrawPosition] = useState("right");

    const radioButtons = useMemo(
        () => [
            {
                id: "1", // acts as primary key, should be unique and non-empty string
                label: "Increase",
                value: "",
            },
            {
                id: "2",
                label: "Decrease",
                value: "",
            },
        ],
        []
    );

    const [selectedId, setSelectedId] = useState();

    const [min, setMin] = useState(0);
    const [max, setMax] = useState(0);

    const [filterRooms, setFilterRooms] = useState(listRooms);

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
            setFilterRooms(roomData.result)
            setSearchID(roomData.location_id);
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
                headerRight: () => {
                    return (
                        <Text onPress={() => draw.current.openDrawer()}>
                            Filter
                        </Text>
                    );
                },
            });
        }
    }, []);

    const handleFilter = () => {
        let filteredRooms = [...listRooms]; // Create a new array with all rooms
        console.log(max);
        if (max > 0) {
            filteredRooms = filteredRooms.filter(
                (item) =>
                    item.min_total_price >= min && item.min_total_price <= max
            );
        }

        if (selectedId) {
            if (selectedId == 1) {
                filteredRooms.sort(
                    (a, b) => a.min_total_price - b.min_total_price
                );
            } else if (selectedId == 2) {
                filteredRooms.sort(
                    (a, b) => b.min_total_price - a.min_total_price
                );
            }
        }

        setFilterRooms(filteredRooms); // Update the state with the filtered and sorted rooms
        console.log(filteredRooms);
    };

    const navigationView = () => {
        return (
            <View style={[styles.container]}>
                <Text>Sort</Text>
                <RadioGroup
                    radioButtons={radioButtons}
                    onPress={setSelectedId}
                    selectedId={selectedId}
                />
                <Text>Price</Text>
                <View style={{ flexDirection: "row" }}>
                    <TextInput
                        placeholder="Min"
                        style={{
                            width: 125,
                            borderColor: "gray",
                            borderWidth: 1,
                            padding: 10,
                        }}
                        keyboardType="numeric"
                        onChangeText={(num) => setMin(num)}
                    />
                    <Text style={{ justifyContent: "center", padding: 10 }}>
                        {" "}
                        -{" "}
                    </Text>
                    <TextInput
                        placeholder="Max"
                        style={{
                            width: 125,
                            borderColor: "gray",
                            borderWidth: 1,
                            padding: 10,
                        }}
                        keyboardType="numeric"
                        onChangeText={(num) => setMax(num)}
                    />
                </View>
                <TouchableOpacity style={styles.bookingButton}>
                    <Text
                        style={styles.bookingButtonText}
                        onPress={() => handleFilter()}
                    >
                        Submit
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.bookingButton, { backgroundColor: "red" }]}
                >
                    <Text style={styles.bookingButtonText}>Reset</Text>
                </TouchableOpacity>
            </View>
        );
    };
    return (
        <DrawerLayoutAndroid
            ref={draw}
            drawerWidth={300}
            drawerPosition={drawPosition}
            renderNavigationView={navigationView}
        >
            <View style={styles.container}>
                {listRooms?.zero_results_message ? (
                    <View>
                        <Text>{listRooms?.zero_results_message.title}</Text>
                    </View>
                ) : (
                    <FlatList
                        data={filterRooms}
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
        </DrawerLayoutAndroid>
    );
}
