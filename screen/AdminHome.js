import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    SafeAreaView,
    Image,
    TouchableOpacity,
    FlatList,
} from "react-native";
import styles from "../styles";
import axios from "axios";

const ItemView = (props) => {
    const { item, handleRoomPress } = props;

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
                    <Text>{item.hotel_name}</Text>
                    <Text>{item.address}</Text>
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

export default function AdminHome({ navigation }) {
    const [locations, setLocations] = useState();
    const [bookings, setBookings] = useState();
    const [hotels, setHotels] = useState();
    const [users, setUsers] = useState();

    const fetchLocations = async () => {
        const options = {
            method: "GET",
            url: "https://api.toluu.site/post/auto-complete.php",
            params: {
                text: "",
            },
        };

        try {
            const response = await axios.request(options);
            const responseData = response.data;
            setLocations(responseData.result);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchBookings = async () => {
        const options = {
            method: "GET",
            url: "https://api.toluu.site/post/booking.php?all",
        };

        try {
            const response = await axios.request(options);
            const responseData = response.data;
            setBookings(responseData.result);
        } catch (err) {
            console.error("Axios Error:", err);
        }
    };

    const fetchHotels = async () => {
        const options = {
            method: "GET",
            url: "https://api.toluu.site/post/getRooms.php?all",
        };

        try {
            const response = await axios.request(options);
            const responseData = response.data;
            setHotels(responseData.result);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchUsers = async () => {
        const options = {
            method: "GET",
            url: "https://api.toluu.site/post/account.php?all",
        };

        try {
            const response = await axios.request(options);
            const responseData = response.data;
            setUsers(JSON.parse(responseData.result));
        } catch (err) {
            console.error(err);
        }
    };

    const handleRoomPress = (item) => {
        navigation.navigate("OrderDetails", { booking: item });
    };

    const handleLocationsPress = () => {
        navigation.navigate("ListLocations");
    };

    const handleHotelsPress = () => {
        navigation.navigate("ListHotels");
    };

    const handleBookingsPress = () => {
        navigation.navigate("ListBookings");
    };

    const handleUsersPress = () => {
        navigation.navigate("ListUsers");
    };

    useEffect(() => {
        navigation.setOptions({
            title: "Admin",
        });
        fetchLocations();
        fetchBookings();
        fetchHotels();
        fetchUsers();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.adminMenu}>
                <View style={styles.adminRow}>
                    <TouchableOpacity
                        style={[
                            styles.adminColumn,
                            { backgroundColor: "#FFB6C1", marginRight: 10 },
                        ]}
                        onPress={() => handleLocationsPress()}
                    >
                        <Text style={styles.adminNumber}>
                            {locations ? locations.length : 0}
                        </Text>
                        <Text style={styles.adminLabel}>Location</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.adminColumn,
                            { backgroundColor: "#FF8683" },
                        ]}
                        onPress={() => handleHotelsPress()}
                    >
                        <Text style={styles.adminNumber}>
                            {hotels ? hotels.length : 0}
                        </Text>
                        <Text style={styles.adminLabel}>Hotels</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.adminRow}>
                    <TouchableOpacity
                        style={[
                            styles.adminColumn,
                            { backgroundColor: "#90EE90", marginRight: 10 },
                        ]}
                        onPress={() => handleBookingsPress()}
                    >
                        <Text style={styles.adminNumber}>
                            {bookings ? bookings.length : 0}
                        </Text>
                        <Text style={styles.adminLabel}>Bookings</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.adminColumn,
                            { backgroundColor: "#86c5da" },
                        ]}
                        onPress={() => handleUsersPress()}
                    >
                        <Text style={styles.adminNumber}>
                            {users ? users.length : 0}
                        </Text>
                        <Text style={styles.adminLabel}>Users</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{ flex: 1 }}>
                <View style={{ padding: 10 }}>
                    <Text style={{ fontSize: 15 }}>Recent bookings</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={bookings}
                        renderItem={({ item }) => (
                            <ItemView
                                item={item}
                                navigation={navigation}
                                handleRoomPress={handleRoomPress}
                            />
                        )}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}
