import React, { useEffect, useState } from "react";
import {
    SafeAreaView,
    Text,
    View,
    ScrollView,
    TouchableOpacity, // Import TouchableOpacity
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { SliderBox } from "react-native-image-slider-box";
import Ionicons from "react-native-vector-icons/Ionicons";
import styles from "../styles";
import { el } from "date-fns/locale";

const getDescription = async (hotelID) => {
    const options = {
        method: "GET",
        url: "https://api.toluu.site/post/getRooms.php?description",
        params: {
            hotel_id: hotelID,
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
    const [review, setReview] = useState(0);
    const [description, setDescription] = useState();
    const [photo, setPhoto] = useState();
    const navigation = useNavigation();

    console.log(Number.parseFloat(route.params.item.score).toFixed(1));

    const onReviewedPress = () => {
        navigation.navigate("ReviewDetails", { review });
    };

    useEffect(() => {
        setDetail(route.params.item);
        console.log(detail);
        const fetchRooms = async () => {
            try {
                const options = {
                    method: "GET",
                    url: "https://api.toluu.site/post/getRooms.php?images",
                    params: {
                        hotel_id: route.params.item.id,
                    },
                };
                const response = await axios.request(options);
                const responseData = response.data.result;
                const imgUrl = responseData.map((val) => val.image_url);
                if (imgUrl.length != 0) setPhoto(imgUrl);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchDescription = async () => {
            try {
                const result = await getDescription(route.params.item.id);
                setDescription(result.result[0].content);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchReviewed = async () => {
            const options = {
                method: "GET",
                url: "https://api.toluu.site/post/reviews.php?get",
                params: {
                    hotel_id: route.params.item.id,
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

        fetchRooms();
        fetchDescription();
        fetchReviewed();
    }, []);

    if (!photo) {
        setPhoto([
            "https://user-images.githubusercontent.com/10515204/56117400-9a911800-5f85-11e9-878b-3f998609a6c8.jpg",
        ]);
    }

    let avgScore = 0;
    review &&
        review.map((el) => {
            avgScore += el.star;
        });
    console.log(avgScore);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View>
                    {photo ? (
                        <SliderBox
                            images={photo}
                            sliderBoxHeight={200}
                            dotColor="#FFFFFF"
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
                    <TouchableOpacity onPress={onReviewedPress}>
                        <Text style={styles.address}>
                            <Ionicons name="star" color={"#FDCC0D"} size={15} />{" "}
                            {avgScore
                                ? `${avgScore} / 5 (${review.length} reviews)`
                                : "No reviews available"}
                        </Text>
                    </TouchableOpacity>
                    <Text style={styles.price}>
                        <Ionicons name="cash-outline" size={15} />{" "}
                        {route.params.item.min_total_price.toLocaleString(
                            "en-US"
                        )}{" "}
                        {route.params.item.currency_code}
                    </Text>
                    <Text style={styles.address}>
                        <Ionicons name="location-outline" size={15} />{" "}
                        {route.params.item.address},{" "}
                        {route.params.item.city_name}
                    </Text>
                    <Text style={styles.checkin}>
                        <Ionicons name="time-outline" size={15} /> Check-in:{" "}
                        {route.params.item.checkin?.from}{" "}
                        {route.params.data.startDate}
                    </Text>
                    <Text style={styles.checkin}>
                        <Ionicons name="time-outline" size={15} /> Check-out:{" "}
                        {route.params.item.checkout?.until}{" "}
                        {route.params.data.endDate}
                    </Text>
                    <Text style={styles.hotelName}>Description</Text>
                    <Text style={styles.description}>
                        {description ? description : "No description"}
                    </Text>
                </View>
            </ScrollView>

            <TouchableOpacity
                onPress={() =>
                    handleBooking(
                        {
                            searchID: route.params.searchID,
                            hotelID: route.params.item.id,
                            hotelName: route.params.item.hotel_name,
                            address: route.params.item.address,
                            city: route.params.item.city_name,
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
