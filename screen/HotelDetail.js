import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, FlatList } from "react-native";
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
                    <Text>{item.hotel_address}</Text>
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

export default function HotelDetail({ navigation, route }) {
    const hotel = route.params.hotel;
    const [bookings, setBookings] = useState();
    const [review, setReview] = useState();

    const handleEditHotelPress = () => {
        navigation.navigate("HotelDetailUpdate", { hotel });
    };
    const handleRoomPress = (item) => {
        navigation.navigate("OrderDetails", { booking: item });
    };

    const getBookings = async () => {
        const options = {
            method: "GET",
            url: "https://api.toluu.site/post/booking.php?hotel",
            params: {
                hotelID: hotel.id,
            },
        };
        console.log(hotel.id);
        try {
            const response = await axios.request(options);
            const responseData = response.data;
            console.log(responseData);
            setBookings(responseData.result);
        } catch (err) {
            console.error(err);
        }
    };

    const getReviews = async () => {
        const options = {
            method: "GET",
            url: "https://api.toluu.site/post/reviews.php?get",
            params: {
                hotel_id: hotel.id,
            },
        };

        try {
            const response = await axios.request(options);
            const responseData = response.data;
            setReview(responseData.result);
        } catch (error) {
            console.error(error);
            return []; // Return an empty array in case of an error
        }
    };

    useEffect(() => {
        navigation.setOptions({
            title: hotel?.hotel_name,
            headerRight: () => (
                <TouchableOpacity onPress={() => handleEditHotelPress()}>
                    <Text>Edit hotel</Text>
                </TouchableOpacity>
            ),
        });
        getBookings();
        getReviews();
    }, []);

    let avgScore = 0;
    review &&
        review.map((el) => {
            avgScore += el.star;
        });

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.bookingButton}
                onPress={() => navigation.navigate("ReviewDetails", { review })}
            >
                <Text style={styles.bookingButtonText}>
                    {avgScore}/5 ({review?.length} review)
                </Text>
            </TouchableOpacity>
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
    );
}
