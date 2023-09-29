import React, { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "../styles";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function Success({ route }) {
    const navigation = useNavigation();
    useEffect(() => {
        navigation.setOptions({
            title: "",
        });
    }, []);
    return (
        <View style={[styles.container, { alignItems: "center" }]}>
            <Ionicons
                name="checkmark-circle-outline"
                size={150}
                style={{ color: "green" }}
            />
            <Text style={{ fontWeight: "bold", fontSize: 20 }}>Success!</Text>
            <Text style={{ fontSize: 20 }}>
                Your order id: {route.params?.OrderID}
            </Text>
            <Text>We will send order details to your email soon.</Text>
            <TouchableOpacity
                style={styles.bookingButton}
                onPress={() => navigation.navigate("Dashboard")}
            >
                <Text style={styles.bookingButtonText}>Go to home</Text>
            </TouchableOpacity>
        </View>
    );
}
