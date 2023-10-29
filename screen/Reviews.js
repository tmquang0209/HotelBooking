import React, { useState } from "react";
import { View, Text } from "react-native";
import styles from "../styles";
import { Rating } from "react-native-elements";
import { TextInput } from "react-native";
import { TouchableOpacity } from "react-native";
import axios from "axios";
import { Alert } from "react-native";

export default function Reviews({ navigation, route }) {
    const booking = route.params.booking;
    const [star, setStar] = useState(0);
    const [message, setMessage] = useState("");
    console.log(booking.hotel_id);
    const onSubmitPress = async () => {
        const options = {
            method: "POST",
            url: "https://api.toluu.site/post/reviews.php?add",
            data: {
                booking,
                star,
                message,
            },
        };
        try {
            const response = await axios.request(options);
            const responseData = response.data;
            console.log(responseData);

            Alert.alert("Message", "Review success!");
            navigation.goBack();
        } catch (err) {
            console.error(err);
        }
    };

    const onRatingChange = (value) => {
        setStar(value);
    };

    return (
        <View style={styles.container}>
            <Rating
                showRating
                imageSize={40}
                onFinishRating={onRatingChange}
                style={{ paddingVertical: 10 }}
            />
            <TextInput
                multiline
                placeholder="Write some reviews"
                style={{ borderWidth: 1, padding: 10, borderRadius: 10 }}
                onChangeText={(text) => setMessage(text)}
            />
            <TouchableOpacity
                style={styles.bookingButton}
                onPress={onSubmitPress}
            >
                <Text style={styles.bookingButtonText}>Review</Text>
            </TouchableOpacity>
        </View>
    );
}
