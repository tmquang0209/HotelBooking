import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import styles from "../styles";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native";
import axios from "axios";

export default function OrderDetails({ route }) {
    const navigation = useNavigation();
    const { params } = route;
    const { booking } = params;

    const [account, setAccount] = useState();

    const checkInDate = new Date(booking.check_in);
    const checkOutDate = new Date(booking.check_out);

    // Calculate the difference in days
    const timeDifference = checkOutDate - checkInDate;
    const totalDays = timeDifference / (1000 * 60 * 60 * 24);

    const getAccount = async () => {
        const data = await AsyncStorage.getItem("Account");
        if (data) {
            const dataJson = JSON.parse(data);
            setAccount(dataJson);
        }
    };

    const onCheckInPress = async () => {
        const options = {
            method: "GET",
            url: "https://api.toluu.site/post/booking.php?updateStatus",
            params: { id: booking.id, status: "check_in" },
        };

        try {
            await axios.request(options);
            booking.status = "check_in";
            Alert.alert("Message", "Check-in successful");
        } catch (err) {
            console.error(err);
        }
    };

    const onCheckOutPress = async () => {
        const options = {
            method: "GET",
            url: "https://api.toluu.site/post/booking.php?updateStatus",
            params: {
                id: booking.id,
                status: "check_out",
            },
        };

        try {
            const response = await axios.request(options);
            const responseData = response.data;
            console.log(responseData);
            booking.status = "check_out";
            Alert.alert("Message", "Check-out successful");
        } catch (err) {
            console.error(err);
        }
    };

    const onCancelPress = async () => {
        const options = {
            method: "GET",
            url: "https://api.toluu.site/post/booking.php?update",
            params: { id: booking.id, status: "cancel" },
        };

        try {
            const response = await axios.request(options);
            const responseData = response.data;
            console.log(responseData);
            booking.status = "cancel";
            Alert.alert(
                "Message",
                "The reservation has been successfully canceled"
            );
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        navigation.setOptions({
            title: "Order detail",
        });
        getAccount();
    }, []);

    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={{ flex: 1, flexDirection: "row" }}>
                    <Text style={{ flex: 1, fontSize: 20, fontWeight: 500 }}>
                        #{booking.id}
                    </Text>
                    <View
                        style={{
                            flex: 1,
                            alignItems: "flex-end",
                            justifyContent: "flex-start",
                        }}
                    >
                        <Text style={{ fontSize: 20 }}>{booking.status}</Text>
                    </View>
                </View>
                <Text style={styles.detailInfo}>
                    <Ionicons name="person-outline" size={12} /> Full name:
                    {booking.first_name} {booking.last_name}
                </Text>
                <Text style={styles.detailInfo}>
                    <Ionicons name="navigate-outline" size={12} /> Address:{" "}
                    {booking.address}, {booking.city}
                </Text>
                <Text style={styles.detailInfo}>
                    <Ionicons name="phone-portrait-outline" size={12} /> Mobile
                    phone: {booking.mobile_phone}
                </Text>
                <Text style={styles.detailInfo}>
                    <Ionicons name="mail-outline" size={12} /> Email:{" "}
                    {booking.email}
                </Text>
                <Text style={styles.detailInfo}>
                    <Ionicons name="calendar-outline" size={12} /> Order date:{" "}
                    {booking.create_date}
                </Text>
                <View style={styles.horLine}></View>
                <Text style={styles.hotelName}>
                    <Ionicons name="business-outline" size={15} />{" "}
                    {booking.hotel_name}
                </Text>
                <Text style={styles.address}>
                    <Ionicons name="location-outline" size={15} />
                    {booking.address}, {booking.city}
                </Text>
                <View style={styles.horLine}></View>
                <View style={styles.detailContainer}>
                    <View style={styles.column}>
                        <Text>Check-in</Text>
                        <Text style={{ fontWeight: "bold" }}>
                            {booking.check_in}
                        </Text>
                    </View>
                    <View style={styles.separator}></View>
                    <View style={styles.column}>
                        <Text>Check-out</Text>
                        <Text style={{ fontWeight: "bold" }}>
                            {booking.check_out}
                        </Text>
                    </View>
                </View>
                <View style={styles.horLine}></View>
                <View style={styles.detailContainer}>
                    <View style={styles.column}>
                        <Text>Guest</Text>
                        <Text style={{ fontWeight: "bold" }}>
                            {booking.qty_people} people
                        </Text>
                    </View>
                </View>
                <View style={styles.horLine}></View>
                <View style={styles.detailContainer}>
                    <View style={styles.column}>
                        <Text>Quantity of Rooms</Text>
                        <Text style={{ fontWeight: "bold" }}>Price</Text>
                    </View>
                    <View style={styles.column}>
                        <Text>
                            {booking.qty_room}{" "}
                            {booking.qty_room === 1 ? "room" : "rooms"}
                        </Text>
                        <Text style={{ fontWeight: "bold" }}>
                            {booking?.total_price?.toLocaleString("en-US")}{" "}
                            {booking.currency_code}/ {totalDays} days
                        </Text>
                    </View>
                </View>
                <View>
                    {booking.status === "booked" &&
                        account?.type === "admin" && (
                            <View>
                                <TouchableOpacity
                                    style={styles.bookingButton}
                                    onPress={() => onCheckInPress()}
                                >
                                    <Text style={styles.bookingButtonText}>
                                        Check-in
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    {booking.status === "check_in" &&
                        account?.type === "admin" && (
                            <TouchableOpacity
                                style={styles.bookingButton}
                                onPress={() => onCheckOutPress()}
                            >
                                <Text style={styles.bookingButtonText}>
                                    Check-out
                                </Text>
                            </TouchableOpacity>
                        )}
                    {booking.status === "booked" && (
                        <View>
                            <TouchableOpacity
                                style={[
                                    styles.bookingButton,
                                    { backgroundColor: "red" },
                                ]}
                                onPress={() => onCancelPress()}
                            >
                                <Text style={styles.bookingButtonText}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </View>
        </ScrollView>
    );
}
