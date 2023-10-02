import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, FlatList } from "react-native";
import styles from "../styles";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
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

const ItemView = (props) => {
    const { booking, navigation } = props;
    const [detail, setDetail] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            const detailData = await getDetail(
                booking.hotel_id,
                booking.search_id,
                booking.check_out,
                booking.check_in,
                booking.qty_people,
                booking.qty_room
            );
            setDetail(detailData);
        };

        fetchData();
    }, []);
    if (!detail) {
        // Return a loading state or null while data is being fetched
        return null;
    }

    const handlePress = () => {
        navigation.navigate("OrderDetails", { booking, detail });
    };

    return (
        <TouchableOpacity onPress={() => handlePress()}>
            <View style={styles.roomContainer}>
                {/* <Image
                    style={styles.roomImage}
                    source={{
                        uri: item.main_photo_url,
                    }}
                /> */}

                <View style={styles.roomDetails}>
                    <Text>
                        #{booking.id} {detail[0].hotel_name}
                    </Text>
                    <Text>
                        {detail[0].address}, {detail[0].city}
                    </Text>
                    <Text style={styles.priceText}>
                        {booking?.total_price?.toLocaleString("en-us")}{" "}
                        {booking.currency_code}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default function ListOrders({ route }) {
    const navigation = useNavigation();
    const [account, setAccount] = useState(route.params.account);
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
    console.log("Bookings ", bookings);
    return (
        <View style={styles.container}>
            <FlatList
                data={bookings}
                renderItem={({ item }) => (
                    <ItemView booking={item} navigation={navigation} />
                )}
                // key={}
            />
        </View>
    );
}
