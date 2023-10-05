import React, { useEffect, useState } from "react";
import {
    Alert,
    View,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    TextInput,
    Keyboard,
    ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import Ionicons from "react-native-vector-icons/Ionicons";
import styles from "../styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DatePicker from "react-native-date-ranges";

const handleBooking = async (
    firstName,
    lastName,
    email,
    address,
    city,
    mobilePhone,
    hotelDetail,
    totalPrice
) => {
    const options = {
        method: "GET",
        url: "https://api.toluu.site/post/booking.php",
        params: {
            firstName,
            lastName,
            email,
            address,
            city,
            mobilePhone,
            hotelDetail,
            totalPrice,
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

export default function Book({ route }) {
    const navigation = useNavigation();

    const [account, setAccount] = useState();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [hotelDetail, setHotelDetail] = useState(route.params.data);

    const [total, setTotal] = useState({
        price: 0,
        days: 0,
    });

    const getAccountInfo = async () => {
        try {
            const accountInfo = await AsyncStorage.getItem("Account");
            if (accountInfo) {
                const accountJson = JSON.parse(accountInfo);
                setAccount(accountJson);

                const fullName = accountJson.full_name;
                if (fullName) {
                    const nameArray = fullName.split(" ");
                    if (nameArray.length > 1) {
                        const getLastName = nameArray[nameArray.length - 1];
                        nameArray.pop();
                        const getFirstName = nameArray.join(" ");
                        setFirstName(getFirstName);
                        setLastName(getLastName);
                    }
                }
            }
        } catch (error) {
            console.error(error);
            // Handle the error if needed
        }
    };

    const onDateChange = (value) => {
        const startDate = value.startDate.replaceAll("/", "-");
        const endDate = value.endDate.replaceAll("/", "-");

        setHotelDetail({
            ...hotelDetail,
            checkIn: startDate,
            checkOut: endDate,
        });

        // Calculate the difference in days
        const checkInDate = new Date(startDate);
        const checkOutDate = new Date(endDate);
        const timeDifference = checkOutDate - checkInDate;
        const days = timeDifference / (1000 * 60 * 60 * 24);

        // Calculate the new price
        const price = hotelDetail.numOfRoom * hotelDetail.price * days;

        // Update the total state with the new values
        setTotal({ days, price });
    };

    useEffect(() => {
        navigation.setOptions({
            title: "Booking Info",
        });
        getAccountInfo();
        calcTotalDay();
    }, []);

    const calcTotalDay = () => {
        const checkInDate = new Date(hotelDetail.checkIn);
        const checkOutDate = new Date(hotelDetail.checkOut);

        // Calculate the difference in days
        const timeDifference = checkOutDate - checkInDate;
        const days = timeDifference / (1000 * 60 * 60 * 24);

        // Calculate the new price
        const price = hotelDetail.numOfRoom * hotelDetail.price * days;

        // Update the total state with the new values
        setTotal({ days, price });
    };

    const handleBookingConfirmation = async () => {
        try {
            const response = await handleBooking(
                firstName,
                lastName,
                account.email,
                account.address,
                account.city,
                account.mobile_number,
                hotelDetail,
                total.price
            );

            // If booking is successful, navigate to the "Success" page
            if (response && response.OrderID) {
                navigation.navigate("Success", { OrderID: response.OrderID });
            }
        } catch (error) {
            console.error(error);
            // Handle the error if needed
        }
    };

    return (
        <TouchableWithoutFeedback
            onPress={() => {
                Keyboard.dismiss();
            }}
        >
            <ScrollView>
                <View style={styles.container}>
                    <View
                        style={{ height: 60, marginBottom: 10, marginStart: 5 }}
                    >
                        <Text>First name: </Text>
                        <TextInput
                            style={styles.input}
                            value={firstName}
                            onChangeText={(text) => setFirstName(text)}
                        />
                    </View>
                    <View
                        style={{ height: 60, marginBottom: 10, marginStart: 5 }}
                    >
                        <Text>Last name: </Text>
                        <TextInput
                            style={styles.input}
                            value={lastName}
                            onChangeText={(text) => setLastName(text)}
                        />
                    </View>
                    <View
                        style={{ height: 60, marginBottom: 10, marginStart: 5 }}
                    >
                        <Text>Email Address: </Text>
                        <TextInput
                            style={styles.input}
                            value={account?.email}
                            onChangeText={(text) =>
                                setAccount({ ...account, email: text })
                            }
                        />
                    </View>
                    <View
                        style={{ height: 60, marginBottom: 10, marginStart: 5 }}
                    >
                        <Text>Address: </Text>
                        <TextInput
                            style={styles.input}
                            value={account?.address}
                            onChangeText={(text) =>
                                setAccount({ ...account, address: text })
                            }
                        />
                    </View>
                    <View
                        style={{ height: 60, marginBottom: 10, marginStart: 5 }}
                    >
                        <Text>City: </Text>
                        <TextInput
                            style={styles.input}
                            value={account?.city}
                            onChangeText={(text) =>
                                setAccount({ ...account, city: text })
                            }
                        />
                    </View>
                    <View
                        style={{ height: 60, marginBottom: 10, marginStart: 5 }}
                    >
                        <Text>Mobile Number: </Text>
                        <TextInput
                            style={styles.input}
                            value={account?.mobile_number}
                            keyboardType="numeric"
                            onChangeText={(text) =>
                                setAccount({ ...account, mobile_number: text })
                            }
                        />
                    </View>
                    <View style={styles.horLine}></View>
                    <View>
                        <Text style={styles.hotelName}>
                            <Ionicons name="business-outline" size={15} />{" "}
                            {hotelDetail.hotelName}
                        </Text>
                        <Text style={styles.address}>
                            <Ionicons name="location-outline" size={15} />
                            {hotelDetail.address}, {hotelDetail.city}
                        </Text>
                        <View style={styles.horLine}></View>
                        <View style={styles.dateContainer}>
                            <View style={{ flexDirection: "row" }}>
                                <Text style={{ width: "50%" }}>Check-in</Text>
                                <Text>Check-in</Text>
                            </View>
                            <View>
                                <DatePicker
                                    style={{
                                        borderColor: "white",
                                        fontWeight: "bold",
                                    }}
                                    customStyles={{
                                        placeholderText: {
                                            fontSize: 20,
                                            color: "black",
                                            fontWeight: "bold",
                                        }, // placeHolder style
                                        contentText: {
                                            fontSize: 20,
                                            color: "black",
                                            fontWeight: "bold",
                                        }, //after selected text Style
                                    }} // optional
                                    allowFontScaling={false} // optional
                                    placeholder={`${hotelDetail.checkIn} -> ${hotelDetail.checkOut}`}
                                    mode={"range"}
                                    markText={" "}
                                    dateSplitter={"->"}
                                    ButtonText={"Confirm"}
                                    blockBefore={true}
                                    inFormat="YYYY-MM-DD"
                                    outFormat="YYYY-MM-DD"
                                    onConfirm={(value) => {
                                        onDateChange(value);
                                    }}
                                />
                            </View>
                        </View>
                        <View style={styles.horLine}></View>
                        <View style={styles.dateContainer}>
                            <View style={styles.column}>
                                <Text>Guest</Text>
                                <Text style={{ fontWeight: "bold" }}>
                                    {hotelDetail.numOfPeople} people
                                </Text>
                            </View>
                        </View>
                        <View style={styles.horLine}></View>
                        <View style={styles.dateContainer}>
                            <View style={styles.column}>
                                <Text>Quantity of Rooms</Text>
                                <Text style={{ fontWeight: "bold" }}>
                                    Price
                                </Text>
                            </View>
                            <View style={styles.column}>
                                <Text>
                                    {hotelDetail.numOfRoom} *{" "}
                                    {hotelDetail.price.toLocaleString("en-US")}{" "}
                                    {hotelDetail.currency_code}
                                </Text>
                                <Text style={{ fontWeight: "bold" }}>
                                    {total.price.toLocaleString("en-US")}{" "}
                                    {hotelDetail.currency_code}/ {total.days}{" "}
                                    days
                                </Text>
                            </View>
                        </View>
                        <View style={styles.horLine}></View>
                        <View style={styles.dateContainer}>
                            <View style={styles.column}>
                                <Text>
                                    <Ionicons name="card-outline" size={15} />{" "}
                                    Payment method
                                </Text>
                            </View>
                            <View style={styles.column}>
                                <Text>Cash</Text>
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={() =>
                            Alert.alert(
                                "Confirm Booking",
                                "Are you sure you want to book this room?",
                                [
                                    {
                                        text: "No",
                                        onPress: () => console.log("Press no"),
                                    },
                                    {
                                        text: "Yes",
                                        onPress: () =>
                                            handleBookingConfirmation(),
                                    },
                                ]
                            )
                        }
                        style={styles.bookingButton}
                    >
                        <Text style={styles.bookingButtonText}>Book Now</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </TouchableWithoutFeedback>
    );
}
