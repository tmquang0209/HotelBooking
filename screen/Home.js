import React from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import styles from "../styles";

export default function Home({ navigation }) {
    return (
        <View style={styles.container}>
            <View style={{ flex: 1 }}>
                <Image
                    style={{ flex: 1, width: "100%" }}
                    source={{
                        uri: "https://as1.ftcdn.net/v2/jpg/02/52/66/16/1000_F_252661691_bKML6FavTjna7p9SQ2EPfFVcqh8cqy2H.jpg",
                    }}
                />
                <TouchableOpacity
                    style={{
                        position: "absolute",
                        backgroundColor: "#3083e3",
                        margin: 10,
                        padding: 10,
                        alignItems: "center",
                        borderRadius: 20,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        marginTop: 10000,
                    }}
                    onPress={() => navigation.navigate("Search")}
                >
                    <Text style={{ color: "white" }}>Search location</Text>
                </TouchableOpacity>
            </View>
            <View
                style={{
                    // position: "absolute",
                    flex: 1,
                }}
            ></View>
            <View
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    margin: 10,
                }}
            >
                <TouchableOpacity
                    style={{
                        backgroundColor: "#3083e3",
                        margin: 10,
                        padding: 10,
                        alignItems: "center",
                        borderRadius: 20,
                    }}
                    onPress={() =>
                        navigation.navigate("Book", {
                            data: {
                                hotelName: "JW Mariott",
                                address: "Do Duc Duc, Nam Tu Liem",
                                city: "Ha Noi",
                                checkIn: "2023-09-09",
                                checkOut: "2023-09-10",
                                numOfPeople: 1,
                                numOfRoom: 2,
                                price: 100000,
                                currency_code: "VND",
                            },
                        })
                    }
                >
                    <Text style={{ color: "white" }}>Book</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        backgroundColor: "#3083e3",
                        margin: 10,
                        padding: 10,
                        alignItems: "center",
                        borderRadius: 20,
                    }}
                    onPress={() => navigation.navigate("Success")}
                >
                    <Text style={{ color: "white" }}>Success</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
