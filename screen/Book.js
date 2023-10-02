import React, { useEffect, useState } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";

const handleBooking = async (
    firstName,
    lastName,
    email,
    address,
    city,
    mobilePhone,
    hotelDetail,
    totalPrice
) => {
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
        return response.data; // Return the autocomplete suggestions
    } catch (error) {
        console.error(error);
        return []; // Return an empty array in case of an error
    }
};

export default function Book({ route }) {
    const navigation = useNavigation();
    const [account, setAccount] = useState();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState();
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [mobilePhone, setMobilePhone] = useState("");
    const [hotelDetail, setHotelDetail] = useState(route.params.data);

    const getAccountInfo = async () => {
        const accountInfo = await AsyncStorage.getItem("Account");
        if (accountInfo) {
            const accountJson = JSON.parse(accountInfo);
            setAccount(accountJson);

            const fullName = account.full_name;
            const nameArray = fullName.split(" ");
            if (nameArray.length > 1) {
                const getLastName = nameArray[nameArray.length - 1];
                nameArray.pop();
                const getFirstName = nameArray.join(" ");
                setFirstName(getFirstName);
                setLastName(getLastName);
            }
            setEmail(account.email);
            setAddress(account.address);
            setCity(account.city);
            setMobilePhone(account.mobile_phone);
        }
    };

    useEffect(() => {
        navigation.setOptions({
            title: "Booking Info",
        });
        getAccountInfo();
    }, []);
    // console.log("account", account.email);

    const checkInDate = new Date(hotelDetail.checkIn);
    const checkOutDate = new Date(hotelDetail.checkOut);

    // Calculate the difference in days
    const timeDifference = checkOutDate - checkInDate;
    const totalDays = timeDifference / (1000 * 60 * 60 * 24);

    const [totalPrice, setTotalPrice] = useState(
        hotelDetail.numOfRoom * hotelDetail.price * totalDays
    );

    const [currencyCode, setCurrencyCode] = useState(hotelDetail.currency_code);
    // setHotelDetail(route.params.data);
    const handleBookingConfirmation = async () => {
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

        try {
            const response = await handleBooking(
                firstName,
                lastName,
                email,
                address,
                city,
                mobilePhone,
                hotelDetail,
                totalPrice
            );

            // If booking is successful, navigate to the "Success" page
            if (response && response.OrderID) {
                navigation.navigate("Success", { OrderID: response.OrderID });
            }
        } catch (error) {
            console.error(error);
            // Handle the error if needed
        }
    };
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
                            value={firstName}
                            onChangeText={(text) => setFirstName(text)}
                        />
                    </View>
                    <View
                        style={{ height: 60, marginBottom: 10, marginStart: 5 }}
                    >
                        <Text>Last name: </Text>
                        <TextInput
                            style={styles.input}
                            value={lastName}
                            onChangeText={(text) => setLastName(text)}
                        />
                    </View>
                    <View
                        style={{ height: 60, marginBottom: 10, marginStart: 5 }}
                    >
                        <Text>Email Address: </Text>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                        />
                    </View>
                    <View
                        style={{ height: 60, marginBottom: 10, marginStart: 5 }}
                    >
                        <Text>Address: </Text>
                        <TextInput
                            style={styles.input}
                            value={address}
                            onChangeText={(text) => setAddress(text)}
                        />
                    </View>
                    <View
                        style={{ height: 60, marginBottom: 10, marginStart: 5 }}
                    >
                        <Text>City: </Text>
                        <TextInput
                            style={styles.input}
                            value={city}
                            onChangeText={(text) => setCity(text)}
                        />
                    </View>
                    <View
                        style={{ height: 60, marginBottom: 10, marginStart: 5 }}
                    >
                        <Text>Mobile Number: </Text>
                        <TextInput
                            style={styles.input}
                            value={mobilePhone}
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
                                            handleBookingConfirmation(),
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
