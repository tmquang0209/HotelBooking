import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
    Image,
} from "react-native";
import styles from "../styles";
import axios from "axios";
import { SearchBar, Badge } from "react-native-elements";

const ItemView = (props) => {
    const { item, handleRoomPress } = props;
    let status;
    if (item.status === "booked") status = "primary";
    else if (item.status === "cancel") status = "error";
    else if (item.status === "check_in") status = "warning";
    else if (item.status === "check_out") status = "success";

    return (
        <TouchableOpacity onPress={() => handleRoomPress(item)}>
            <View style={styles.roomContainer}>
                <Image
                    style={styles.roomImage}
                    source={{
                        uri: item.main_photo,
                    }}
                />

                <View style={styles.roomDetails}>
                    <Badge
                        value={item.status}
                        status={status}
                        containerStyle={{
                            position: "absolute",
                            top: 5,
                            right: 10,
                        }}
                    />
                    <View style={{ flex: 1, flexDirection: "row" }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                                #{item.id}
                            </Text>
                        </View>
                    </View>

                    <Text>{item.hotel_name}</Text>
                    <Text>
                        {item.hotel_address}, {item.city_name}
                    </Text>
                    <Text>
                        Booking by {item.first_name} {item.last_name}
                    </Text>
                    <Text>Check-in: {item.check_in}</Text>
                    <Text>Check-out: {item.check_out}</Text>
                    <Text>
                        {item.qty_room} {item.qty_room === 1 ? "room" : "rooms"}{" "}
                        for {item.qty_people} people
                    </Text>
                    <Text style={styles.priceText}>
                        {item?.total_price?.toLocaleString("en-US")}{" "}
                        {item.currency_code}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default function ListBookings({ navigation }) {
    const [list, setList] = useState();
    const [searchList, setSearchList] = useState();
    const [search, setSearch] = useState("");

    const fetchHotels = async () => {
        const options = {
            method: "GET",
            url: "https://api.toluu.site/post/booking.php?all",
        };

        try {
            const response = await axios.request(options);
            const responseData = response.data;
            setList(responseData.result);
            setSearchList(responseData.result);
        } catch (err) {
            console.error(err);
        }
    };

    const handleRoomPress = (item) => {
        navigation.navigate("OrderDetails", { booking: item });
    };

    const onSearchTextChange = (val) => {
        const filterArr = list.filter(
            (item) =>
                item.hotel_name === val ||
                item.id === val ||
                item.city_name === val ||
                item.address === val
        );
        setSearchList(filterArr);
        setSearch(val);
    };

    useEffect(() => {
        navigation.setOptions({
            title: "List Bookings",
        });

        fetchHotels();
    }, []);

    console.log(list);

    return (
        <SafeAreaView style={styles.container}>
            <SearchBar
                containerStyle={{
                    backgroundColor: "#FFFFFF",
                    borderColor: "#FFFFFF",
                }}
                inputContainerStyle={{
                    backgroundColor: "#FFFFFF",
                    borderWidth: 1,
                }}
                placeholder="Typing here..."
                value={search}
                onChangeText={(val) => onSearchTextChange(val)}
                onClear={() => setSearchList(list)}
            />
            <FlatList
                data={searchList}
                renderItem={({ item }) => (
                    <ItemView
                        item={item}
                        navigation={navigation}
                        handleRoomPress={handleRoomPress}
                    />
                )}
            />
        </SafeAreaView>
    );
}
