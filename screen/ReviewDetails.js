import React from "react";
import { View, Text } from "react-native";
import { Rating } from "react-native-elements";
import styles from "../styles";
import { useEffect } from "react";
import { FlatList } from "react-native";

const hiddenEmail = (email) => {
    const emailParts = email.split("@");
    if (emailParts.length === 2) {
        const name = emailParts[0];
        const domain = emailParts[1];

        const hiddenName = name.substr(0, 3) + "****";

        const modifiedEmail = hiddenName + "@" + domain;

        return modifiedEmail;
    } else {
        // Handle invalid email addresses
        return "Invalid Email";
    }
};

export default function ReviewDetails({ navigation, route }) {
    const listReview = route.params.review;

    console.log(listReview);

    useEffect(() => {
        navigation.setOptions({
            title: "Review",
        });
    }, []);
    return (
        <View style={styles.container}>
            <FlatList
                data={listReview}
                key={(item) => item.id}
                renderItem={({ item }) => (
                    <View
                        style={{
                            // borderRadius: 10,
                            padding: 10,
                            shadowColor: "#000",
                            shadowOpacity: 0.5,
                            shadowRadius: 1,
                            elevation: 2,
                        }}
                    >
                        <Text>{hiddenEmail(item.email)}</Text>
                        <Text>{item.date}</Text>
                        <Rating
                            readonly
                            startingValue={item.star}
                            imageSize={20}
                            style={{
                                paddingVertical: 10,
                                alignItems: "flex-start",
                            }}
                        />
                        <Text>
                            {item.message !== ""
                                ? item.message
                                : "No description."}
                        </Text>
                    </View>
                )}
            />
        </View>
    );
}
