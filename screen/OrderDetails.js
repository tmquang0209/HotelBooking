import React, { useEffect } from "react";
import { View, Text } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import styles from "../styles";
import { useNavigation } from "@react-navigation/native";

export default function OrderDetails({ route }) {
    const navigation = useNavigation();
    const { params } = route;
    const { booking, detail } = params;

    const checkInDate = new Date(booking.check_in);
    const checkOutDate = new Date(booking.check_out);

    // Calculate the difference in days
    const timeDifference = checkOutDate - checkInDate;
    const totalDays = timeDifference / (1000 * 60 * 60 * 24);

    useEffect(() => {
        navigation.setOptions({
            title: "Order detail",
        });
    }, []);
    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 20, fontWeight: 500 }}>#{booking.id}</Text>
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
                {detail[0].hotel_name}
            </Text>
            <Text style={styles.address}>
                <Ionicons name="location-outline" size={15} />
                {detail[0].address}, {detail[0].city}
            </Text>
            <View style={styles.horLine}></View>
            <View style={styles.dateContainer}>
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
            <View style={styles.dateContainer}>
                <View style={styles.column}>
                    <Text>Guest</Text>
                    <Text style={{ fontWeight: "bold" }}>
                        {booking.qty_people} people
                    </Text>
                </View>
            </View>
            <View style={styles.horLine}></View>
            <View style={styles.dateContainer}>
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
                        {detail.currency_code}/ {totalDays} days
                    </Text>
                </View>
            </View>
        </View>
    );
}
