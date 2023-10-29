import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, FlatList } from "react-native";
import styles from "../styles";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { Badge } from "react-native-elements";

const ItemView = (props) => {
    const { booking, navigation } = props;
    let status;
    if (booking.status === "booked") status = "primary";
    else if (booking.status === "cancel") status = "error";
    else if (booking.status === "check_in") status = "warning";
    else if (booking.status === "check_out") status = "success";

    const handlePress = () => {
        navigation.navigate("OrderDetails", { booking });
    };

    return (
        <TouchableOpacity onPress={() => handlePress()}>
            <View style={styles.roomContainer}>
                <Image
                    style={styles.roomImage}
                    source={{
                        uri: booking.main_photo,
                    }}
                />

                <View style={styles.roomDetails}>
                    <Text>
                        #{booking.id} {booking?.hotel_name}
                    </Text>
                    <Text>
                        {booking?.hotel_address}, {booking?.city_name}
                    </Text>
                    <Text style={styles.priceText}>
                        {booking?.total_price?.toLocaleString("en-us")}{" "}
                        {booking?.currency_code}
                    </Text>
                </View>
                <Badge
                    value={booking.status}
                    status={status}
                    containerStyle={{
                        // position: "absolute",
                        top: 5,
                        right: 0,
                    }}
                />
            </View>
        </TouchableOpacity>
    );
};

export default function ListOrders({ route }) {
    const navigation = useNavigation();
    const account = route.params.account;
    const [bookings, setBookings] = useState();

    const fetchBookingsData = async () => {
        const options = {
            method: "GET",
            url: "https://api.toluu.site/post/booking.php?getListOrder",
            params: { email: account.email },
        };

        try {
            const response = await axios.request(options);
            const responseData = response.data;
            console.log(responseData);
            setBookings(responseData.result);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        navigation.setOptions({
            title: "Bookings",
        });
        fetchBookingsData();
    }, []);
    // console.log("Bookings ", bookings);
    return (
        <View style={styles.container}>
            <FlatList
                data={bookings}
                renderItem={({ item }) => (
                    <ItemView booking={item} navigation={navigation} />
                )}
                key={({ item }) => item.id}
            />
        </View>
    );
}
