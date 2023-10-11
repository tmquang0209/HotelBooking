import React, { useState, useRef } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
    Alert,
} from "react-native";
import DatePicker from "react-native-date-ranges";
import Autocomplete from "react-native-autocomplete-input";
import Ionicons from "react-native-vector-icons/Ionicons";
import axios from "axios";
import styles from "../styles";
import { format } from "date-fns";

const fetchAutoComplete = async (text, check_in, check_out) => {
    console.log(text);
    const options = {
        method: "GET",
        url: "https://api.toluu.site/post/auto-complete.php",
        params: {
            text: text,
            check_in,
            check_out,
        },
    };

    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error(error);
        return [];
    }
};

export default function Search({ navigation }) {
    const currentDate = new Date();
    const [startDate, setStartDate] = useState(
        format(currentDate, "yyyy-MM-dd")
    );

    const [endDate, setEndDate] = useState(format(currentDate, "yyyy-MM-dd"));

    console.log(startDate, endDate);
    const [formatStartDate, setFormatStartDate] = useState(startDate);
    const [formatEndDate, setFormatEndDate] = useState(endDate);
    console.log(formatStartDate, formatEndDate);

    const [numOfRoom, setNumOfRoom] = useState(1);
    const [numOfPeople, setNumOfPeople] = useState(1);
    const [location, setLocation] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [hideResults, setHideResults] = useState(false);
    const timerRef = useRef(null);
    // console.log(numOfRoom, numOfPeople, location);

    const handleDateChange = (startDate, endDate) => {
        const currentDate = new Date(); // Get the current date with current time
        currentDate.setHours(0, 0, 0, 0); // Set the time to midnight

        // Parse startDate into a Date object with the same format as currentDate
        const startDateParts = startDate.split("/");
        const parsedStartDate = new Date(
            parseInt(startDateParts[0]),
            parseInt(startDateParts[1]) - 1, // Subtract 1 from the month because months are 0-based
            parseInt(startDateParts[2])
        );
        parsedStartDate.setHours(0, 0, 0, 0); // Set the time to midnight for parsedStartDate

        console.log(parsedStartDate < currentDate);

        if (parsedStartDate < currentDate) {
            Alert.alert(
                "Error",
                "Start date must be greater than or equal to the current date."
            );
        } else if (endDate < parsedStartDate) {
            Alert.alert(
                "Error",
                "End date must be greater than or equal to the start date."
            );
        } else {
            setStartDate(startDate);
            setEndDate(endDate);

            setFormatStartDate(startDate.replaceAll("/", "-"));
            setFormatEndDate(endDate.replaceAll("/", "-"));
        }
    };

    const handleLocationChange = (text) => {
        clearTimeout(timerRef.current); // Clear the previous timer

        setLocation(text);

        timerRef.current = setTimeout(async () => {
            const suggestions = await fetchAutoComplete(
                text,
                formatStartDate,
                formatEndDate
            );
            setSuggestions(suggestions.result);
            console.log(suggestions);
        }, 100);
    };

    return (
        <TouchableWithoutFeedback
            onPress={() => {
                Keyboard.dismiss();
                setHideResults(true);
            }}
        >
            <View style={styles.container}>
                <View style={styles.inputForm}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.dateInputLabel}>
                            Check-in - Check-out
                        </Text>
                        <DatePicker
                            style={styles.input}
                            customStyles={{
                                placeholderText: {
                                    fontSize: 20,
                                    color: "black",
                                }, // placeHolder style
                                headerStyle: {}, // title container style
                                headerMarkTitle: {}, // title mark style
                                headerDateTitle: {}, // title Date style
                                contentInput: {}, //content text container style
                                contentText: {}, //after selected text Style
                            }} // optional
                            // centerAlign // optional text will align center or not
                            minDateRange={currentDate} // Add minDate prop here
                            allowFontScaling={false} // optional
                            placeholder={`${startDate} → ${endDate}`}
                            mode={"range"}
                            markText={" "}
                            ButtonText={"Confirm"}
                            blockBefore={true}
                            inFormat="YYYY-MM-DD"
                            outFormat="YYYY-MM-DD"
                            onConfirm={(value) => {
                                handleDateChange(
                                    value.startDate,
                                    value.endDate
                                );
                            }}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.peopleInputLabel}>
                            Number of Rooms
                        </Text>
                        <TextInput
                            placeholder="Number of rooms"
                            value={numOfRoom.toString()}
                            keyboardType="numeric"
                            style={styles.input}
                            onChangeText={(num) => {
                                setNumOfRoom(num);
                            }}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.peopleInputLabel}>
                            Number of People
                        </Text>
                        <TextInput
                            placeholder="Number of people"
                            value={numOfPeople.toString()}
                            keyboardType="numeric"
                            style={styles.input}
                            onChangeText={(num) => {
                                setNumOfPeople(num);
                            }}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.peopleInputLabel}>Destination</Text>
                        <View style={styles.autocompleteContainer}>
                            <Autocomplete
                                data={suggestions}
                                value={location?.city_name || location}
                                placeholder="Where are you going?"
                                hideResults={hideResults}
                                onChangeText={(text) =>
                                    handleLocationChange(text)
                                }
                                onPressIn={() => setHideResults(false)}
                                flatListProps={{
                                    keyExtractor: (_, idx) => idx.toString(),
                                    renderItem: ({ item }) => (
                                        <TouchableOpacity
                                            onPress={() => {
                                                console.log(item);
                                                setLocation(item);
                                                setHideResults(true);
                                            }}
                                        >
                                            <Text style={styles.itemText}>
                                                {item.city_name}
                                            </Text>
                                        </TouchableOpacity>
                                    ),
                                }}
                            />
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.bookingButton}
                        onPress={() => {
                            if (!location || !numOfPeople || !numOfRoom) {
                                Alert.alert(
                                    "Error",
                                    "Please fill out information"
                                );
                            } else {
                                console.log(formatStartDate, formatEndDate);
                                navigation.navigate("ListRooms", {
                                    location,
                                    startDate: formatStartDate,
                                    endDate: formatEndDate,
                                    numOfPeople,
                                    numOfRoom,
                                });
                            }
                        }}
                    >
                        <Text style={styles.bookingButtonText}>
                            <Ionicons name="search-outline" size={15} /> Search
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}
