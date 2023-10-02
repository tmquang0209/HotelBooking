import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Keyboard,
    Alert,
    SafeAreaView,
} from "react-native";
import styles from "../styles";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";
import { API_KEY, API_HOST } from "@env";

const getDetail = async (
    hotelID,
    searchID,
    departureDate,
    arrivalDate,
    numOfPeople,
    numOfRoom
) => {
    const options = {
        method: "GET",
        url: "https://apidojo-booking-v1.p.rapidapi.com/properties/detail",
        params: {
            hotel_id: hotelID,
            search_id: searchID,
            departure_date: departureDate,
            arrival_date: arrivalDate,
            rec_guest_qty: numOfPeople,
            rec_room_qty: numOfRoom,
        },
        headers: {
            "X-RapidAPI-Key": API_KEY,
            "X-RapidAPI-Host": API_HOST,
        },
    };

    try {
        const response = await axios.request(options);
        const responseData = response.data;

        return responseData;
    } catch (err) {
        console.error(err);
    }
};

const fetchOrderID = async (orderID, navigation) => {
    const options = {
        method: "GET",
        url: "https://api.toluu.site/post/getOrder.php",
        params: {
            orderID,
        },
    };
    try {
        const response = await axios.request(options);
        const result = response.data;
        console.log(result);
        if (result.data) {
            return result.data;
        } else {
            Alert.alert("Error", "OrderID not found");
            return null;
        }
    } catch (err) {
        console.error(err);
    }
};

export default function SearchOrder({ navigation }) {
    const [orderID, setOrderID] = useState("");

    const handlePress = async () => {
        const booking = await fetchOrderID(orderID);
        console.log("no", booking);
        if (booking) {
            console.log(123);
            const detail = await getDetail(
                booking.hotel_id,
                booking.search_id,
                booking.check_out,
                booking.check_in,
                booking.qty_people,
                booking.qty_room
            );
            navigation.navigate("OrderDetails", { booking, detail });
        }
    };

    return (
        <TouchableWithoutFeedback
            onPress={() => {
                Keyboard.dismiss();
            }}
        >
            <SafeAreaView style={styles.container}>
                <View style={{ height: 80 }}>
                    <Text style={{ marginBottom: 10 }}>OrderID:</Text>
                    <TextInput
                        style={styles.input}
                        value={orderID}
                        onChangeText={(text) => setOrderID(text)}
                        autoCapitalize="characters" // Set autoCapitalize to "characters"
                    />
                </View>
                <View>
                    <TouchableOpacity
                        style={styles.bookingButton}
                        onPress={() => handlePress()}
                    >
                        <Text style={styles.bookingButtonText}>
                            <Ionicons name="search" size={15} /> Search
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}
