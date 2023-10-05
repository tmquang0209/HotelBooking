import React, { PureComponent } from "react";
import { Dimensions, TouchableOpacity, View, Image, Text } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons"; // Import Ionicons from your preferred source
import styles from "../styles";
export default function RoomListItem(props) {
    const { item, handleRoomPress, searchID, navigation, route } = props;
    const EllipsisText = ({ text, maxWords }) => {
        const words = text.split(" ");

        const displayText = words.slice(0, maxWords).join(" ");
        const isOverflowing = words.length > maxWords;

        return (
            <View style={{ maxWidth: screenWidth }}>
                <Text>
                    {displayText}
                    {isOverflowing ? "..." : ""}
                </Text>
            </View>
        );
    };
    const screenWidth = Dimensions.get("window").width;
    console.log("search", searchID);
    return (
        <TouchableOpacity
            onPress={() =>
                handleRoomPress(
                    searchID,
                    {
                        startDate: route.params.startDate,
                        endDate: route.params.endDate,
                        numOfRoom: route.params.numOfRoom,
                        numOfPeople: route.params.numOfPeople,
                    },
                    item,
                    navigation
                )
            }
        >
            <View style={styles.roomContainer}>
                <Image
                    style={styles.roomImage}
                    source={{
                        uri: item.main_photo_url,
                    }}
                />

                <View style={styles.roomDetails}>
                    <EllipsisText text={item.hotel_name} maxWords={4} />
                    <View style={styles.starContainer}>
                        {Array.from({ length: item.class }).map((_, index) => (
                            <Ionicons
                                key={index}
                                name="star"
                                color="#FFDF00"
                                size={20}
                            />
                        ))}
                    </View>
                    <EllipsisText
                        text={
                            item.district +
                            (item.district ? ", " : "") +
                            item.city
                        }
                        maxWords={4}
                    />
                    <Text style={styles.priceText}>
                        {item.min_total_price.toLocaleString("en-US")}{" "}
                        {item.currency_code}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}
