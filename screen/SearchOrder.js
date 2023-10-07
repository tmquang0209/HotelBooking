import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Keyboard,
    Alert,
    SafeAreaView,
} from "react-native";
import styles from "../styles";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";

const fetchOrderID = async (orderID) => {
    const options = {
        method: "GET",
        url: "https://api.toluu.site/post/getOrder.php",
        params: {
            orderID,
        },
    };
    try {
        const response = await axios.request(options);
        const result = response.data;
        console.log(result);
        if (result.data) {
            return result.data;
        } else {
            Alert.alert("Error", "OrderID not found");
            return null;
        }
    } catch (err) {
        console.error(err);
    }
};

export default function SearchOrder({ navigation }) {
    const [orderID, setOrderID] = useState("");

    const handlePress = async () => {
        const booking = await fetchOrderID(orderID);
        console.log("no", booking);
        if (booking) {
            navigation.navigate("OrderDetails", { booking });
        }
    };

    return (
        <TouchableWithoutFeedback
            onPress={() => {
                Keyboard.dismiss();
            }}
        >
            <SafeAreaView style={styles.container}>
                <View style={{ height: 80, margin: 15 }}>
                    <Text style={{ marginBottom: 10 }}>OrderID:</Text>
                    <TextInput
                        style={styles.input}
                        value={orderID}
                        onChangeText={(text) => setOrderID(text)}
                        autoCapitalize="characters" // Set autoCapitalize to "characters"
                    />
                </View>
                <View>
                    <TouchableOpacity
                        style={styles.bookingButton}
                        onPress={() => handlePress()}
                    >
                        <Text style={styles.bookingButtonText}>
                            <Ionicons name="search" size={15} /> Search
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}
