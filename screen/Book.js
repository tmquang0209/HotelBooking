import React, { useState } from "react";
import {
    Alert,
    View,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    TextInput,
    Keyboard,
    ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";
import styles from "../styles";

const handleBooking = async (
    firstName,
    lastName,
    email,
    address,
    city,
    mobilePhone,
    hotelDetail,
    totalPrice,
    navigation
) => {
    console.log(
        firstName,
        lastName,
        email,
        address,
        city,
        mobilePhone,
        hotelDetail,
        totalPrice
    );
    const options = {
        method: "GET",
        url: "https://api.toluu.site/post/booking.php",
        params: {
            firstName,
            lastName,
            email,
            address,
            city,
            mobilePhone,
            hotelDetail,
            totalPrice,
        },
    };

    try {
        const response = await axios.request(options);
        console.log(response.data);
        navigation.navigate("Success",{OrderID: response.data.OrderID});
        return response.data; // Return the autocomplete suggestions
    } catch (error) {
        console.error(error);
        return []; // Return an empty array in case of an error
    }
};

export default function Book({ route }) {
    const navigation = useNavigation();

    navigation.setOptions({
        title: "Booking Info",
    });

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [mobilePhone, setMobilePhone] = useState("");
    const [hotelDetail, setHotelDetail] = useState(route.params.data);

    const checkInDate = new Date(hotelDetail.checkIn);
    const checkOutDate = new Date(hotelDetail.checkOut);

    // Calculate the difference in days
    const timeDifference = checkOutDate - checkInDate;
    const totalDays = timeDifference / (1000 * 60 * 60 * 24);

    const [totalPrice, setTotalPrice] = useState(
        hotelDetail.numOfRoom * hotelDetail.price * totalDays
    );
    // setHotelDetail(route.params.data);

    return (
        <TouchableWithoutFeedback
            onPress={() => {
                Keyboard.dismiss();
            }}
        >
            <ScrollView>
                <View style={styles.container}>
                    <View
                        style={{ height: 60, marginBottom: 10, marginStart: 5 }}
                    >
                        <Text>First name: </Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => setFirstName(text)}
                        />
                    </View>
                    <View
                        style={{ height: 60, marginBottom: 10, marginStart: 5 }}
                    >
                        <Text>Last name: </Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => setLastName(text)}
                        />
                    </View>
                    <View
                        style={{ height: 60, marginBottom: 10, marginStart: 5 }}
                    >
                        <Text>Email Address: </Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => setEmail(text)}
                        />
                    </View>
                    <View
                        style={{ height: 60, marginBottom: 10, marginStart: 5 }}
                    >
                        <Text>Address: </Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => setAddress(text)}
                        />
                    </View>
                    <View
                        style={{ height: 60, marginBottom: 10, marginStart: 5 }}
                    >
                        <Text>City: </Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => setCity(text)}
                        />
                    </View>
                    <View
                        style={{ height: 60, marginBottom: 10, marginStart: 5 }}
                    >
                        <Text>Mobile Number: </Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            onChangeText={(text) => setMobilePhone(text)}
                        />
                    </View>
                    <View style={styles.horLine}></View>
                    <View>
                        <Text style={styles.hotelName}>
                            <Ionicons name="business-outline" size={15} />{" "}
                            {hotelDetail.hotelName}
                        </Text>
                        <Text style={styles.address}>
                            <Ionicons name="location-outline" size={15} />
                            {hotelDetail.address}, {hotelDetail.city}
                        </Text>
                        <View style={styles.horLine}></View>
                        <View style={styles.dateContainer}>
                            <View style={styles.column}>
                                <Text>Check-in</Text>
                                <Text style={{ fontWeight: "bold" }}>
                                    {hotelDetail.checkIn}
                                </Text>
                            </View>
                            <View style={styles.separator}></View>
                            <View style={styles.column}>
                                <Text>Check-out</Text>
                                <Text style={{ fontWeight: "bold" }}>
                                    {hotelDetail.checkOut}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.horLine}></View>
                        <View style={styles.dateContainer}>
                            <View style={styles.column}>
                                <Text>Guest</Text>
                                <Text style={{ fontWeight: "bold" }}>
                                    {hotelDetail.numOfPeople} people
                                </Text>
                            </View>
                        </View>
                        <View style={styles.horLine}></View>
                        <View style={styles.dateContainer}>
                            <View style={styles.column}>
                                <Text>Quantity of Rooms</Text>
                                <Text style={{ fontWeight: "bold" }}>
                                    Price
                                </Text>
                            </View>
                            <View style={styles.column}>
                                <Text>
                                    {hotelDetail.numOfRoom} *{" "}
                                    {hotelDetail.price.toLocaleString("en-US")}{" "}
                                    {hotelDetail.currency_code}
                                </Text>
                                <Text style={{ fontWeight: "bold" }}>
                                    {totalPrice.toLocaleString("en-US")}{" "}
                                    {hotelDetail.currency_code}/ {totalDays}{" "}
                                    days
                                </Text>
                            </View>
                        </View>
                        <View style={styles.horLine}></View>
                        <View style={styles.dateContainer}>
                            <View style={styles.column}>
                                <Text>
                                    <Ionicons name="card-outline" size={15} />{" "}
                                    Payment method
                                </Text>
                            </View>
                            <View style={styles.column}>
                                <Text>Cash</Text>
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={() =>
                            Alert.alert(
                                "Confirm Booking",
                                "Are you sure you want to book this room?",
                                [
                                    {
                                        text: "No",
                                        onPress: () => console.log("Press no"),
                                    },
                                    {
                                        text: "Yes",
                                        onPress: () =>
                                            handleBooking(
                                                firstName,
                                                lastName,
                                                email,
                                                address,
                                                city,
                                                mobilePhone,
                                                hotelDetail,
                                                totalPrice,
                                                navigation
                                            ),
                                    },
                                ]
                            )
                        }
                        style={styles.bookingButton}
                    >
                        <Text style={styles.bookingButtonText}>Book Now</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </TouchableWithoutFeedback>
    );
}
