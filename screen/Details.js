import React, { useEffect, useState } from "react";
import {
    SafeAreaView,
    Text,
    Dimensions,
    StyleSheet,
    View,
    ScrollView,
    Image,
    TouchableOpacity, // Import TouchableOpacity
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { API_KEY, API_HOST } from "@env";
import { SliderBox } from "react-native-image-slider-box";
import Ionicons from "react-native-vector-icons/Ionicons";
import styles from "../styles";

const getDetails = async (
    searchID,
    hotelID,
    startDate,
    endDate,
    numOfRoom,
    numOfPeople
) => {
    // console.log(startDate, endDate);
    const options = {
        method: "GET",
        url: "https://apidojo-booking-v1.p.rapidapi.com/properties/get-rooms",
        params: {
            departure_date: endDate,
            rec_guest_qty: numOfPeople,
            hotel_id: hotelID,
            arrival_date: startDate,
            search_id: searchID,
        },
        headers: {
            "X-RapidAPI-Key": API_KEY,
            "X-RapidAPI-Host": API_HOST,
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

const getDescription = async (hotelID, checkIn, checkOut) => {
    const options = {
        method: "GET",
        url: "https://apidojo-booking-v1.p.rapidapi.com/properties/get-description",
        params: {
            hotel_ids: hotelID,
            check_out: checkOut,
            languagecode: "vi-vn",
            check_in: checkIn,
        },
        headers: {
            "X-RapidAPI-Key": API_KEY,
            "X-RapidAPI-Host": API_HOST,
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

const handleBooking = (data, navigation) => {
    navigation.navigate("Book", { data });
};

export default function Details({ route }) {
    const [detail, setDetail] = useState([]);
    const [roomID, setRoomID] = useState();
    const [description, setDescription] = useState();
    const [photo, setPhoto] = useState();
    const navigation = useNavigation();
    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const result = await getDetails(
                    route.params.searchID,
                    route.params.item.hotel_id,
                    route.params.data.startDate,
                    route.params.data.endDate,
                    route.params.data.numOfRoom,
                    route.params.data.numOfPeople
                );
                setDetail(result);
                const roomIds = result[0]?.block?.map((e) => e.room_id) || [];
                setRoomID(roomIds);
                const dataPhoto = roomIds.map(
                    (roomId) =>
                        result[0].rooms[roomId].photos.map(
                            (img) => img.url_original
                        ) || "" // Get the first photo's original URL
                );

                setPhoto(dataPhoto);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchDescription = async () => {
            try {
                const result = await getDescription(
                    route.params.item.hotel_id,
                    route.params.data.startDate,
                    route.params.data.endDate
                );
                setDescription(result);
            } catch (error) {
                console.error(error);
            }
        };
        fetchRooms();
        fetchDescription();
    }, []);

    if (!photo) {
        setPhoto([
            [
                "https://user-images.githubusercontent.com/10515204/56117400-9a911800-5f85-11e9-878b-3f998609a6c8.jpg",
            ],
        ]);
    }
    console.log(route.params.searchID);
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View>
                    {photo ? (
                        // <Text></Text>
                        <SliderBox
                            images={photo[0]}
                            sliderBoxHeight={200}
                            onCurrentImagePressed={(index) =>
                                console.warn(`image ${index} pressed`)
                            }
                            dotColor="#FFEE58"
                            inactiveDotColor="#90A4AE"
                            paginationBoxVerticalPadding={20}
                            paginationBoxStyle={styles.paginationBox}
                            dotStyle={styles.dotStyle}
                            autoplay
                            circleLoop
                            ImageComponentStyle={styles.imageComponent}
                            imageLoadingColor="#2196F3"
                        />
                    ) : (
                        ""
                    )}
                </View>
                <View style={styles.infoContainer}>
                    <Text style={styles.hotelName}>
                        {route.params.item.hotel_name}
                    </Text>
                    <Text style={styles.address}>
                        {detail[0]?.host_score
                            ? `${detail[0]?.host_score.toFixed(2)} (${
                                  detail[0]?.host_score_count
                              } reviews)`
                            : "No reviews available"}
                    </Text>
                    <Text style={styles.price}>
                        <Ionicons name="cash-outline" size={15} />{" "}
                        {route.params.item.min_total_price.toLocaleString(
                            "en-US"
                        )}{" "}
                        {route.params.item.currency_code}
                    </Text>
                    <Text style={styles.address}>
                        <Ionicons name="location-outline" size={15} />{" "}
                        {route.params.item.address}, {route.params.item.city}
                    </Text>
                    <Text style={styles.checkin}>
                        <Ionicons name="time-outline" size={15} /> Check-in:{" "}
                        {route.params.item.checkin.from}{" "}
                        {route.params.data.startDate}
                    </Text>
                    <Text style={styles.checkin}>
                        <Ionicons name="time-outline" size={15} /> Check-out:{" "}
                        {route.params.item.checkout.until}{" "}
                        {route.params.data.endDate}
                    </Text>
                    <Text style={styles.hotelName}>Description</Text>
                    <Text style={styles.description}>
                        {description
                            ? description[0].description
                            : "No description"}
                    </Text>
                </View>
            </ScrollView>

            <TouchableOpacity
                onPress={() =>
                    handleBooking(
                        {
                            searchID: route.params.searchID,
                            hotelID: route.params.item.hotel_id,
                            hotelName: route.params.item.hotel_name,
                            address: route.params.item.address,
                            city: route.params.item.city,
                            checkIn: route.params.data.startDate,
                            checkOut: route.params.data.endDate,
                            numOfPeople: route.params.data.numOfPeople,
                            numOfRoom: route.params.data.numOfRoom,
                            price: route.params.item.min_total_price,
                            currency_code: route.params.item.currency_code,
                        },
                        navigation
                    )
                }
                style={styles.bookingButton}
            >
                <Text style={styles.bookingButtonText}>
                    <Ionicons name="wallet-outline" size={15} />
                    Book Now
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
