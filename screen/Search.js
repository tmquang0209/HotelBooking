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
import DatePicker from "../components/DatePicker";
import Autocomplete from "react-native-autocomplete-input";
import axios from "axios";
import styles from "../styles";
import { API_KEY, API_HOST } from "@env";
import { format } from "date-fns";

const fetchAutoComplete = async (text) => {
    console.log(text);
    const options = {
        method: "GET",
        url: "https://apidojo-booking-v1.p.rapidapi.com/locations/auto-complete",
        params: {
            text: text,
            languagecode: "en-us",
        },
        headers: {
            "X-RapidAPI-Key": API_KEY,
            "X-RapidAPI-Host": API_HOST,
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

// `${currentDate.getFullYear()}-${
//     currentDate.getMonth() + 1
// }-${currentDate.getDate()}`;
export default function Search({ navigation }) {
    const currentDate = new Date();
    const [startDate, setStartDate] = useState(currentDate);

    const minEndDate = new Date(startDate);
    minEndDate.setDate(minEndDate.getDate() + 1);

    const [endDate, setEndDate] = useState(minEndDate);
    const [formatStartDate, setFormatStartDate] = useState(
        `${startDate.getFullYear()}-${
            startDate.getMonth() + 1
        }-${startDate.getDate()}`
    );

    // console.log("Start date: ", startDate);
    // console.log("Format start date: ", formatStartDate);

    const [formatEndDate, setFormatEndDate] = useState(
        `${endDate.getFullYear()}-${
            endDate.getMonth() + 1
        }-${endDate.getDate()}`
    );
    const [numOfRoom, setNumOfRoom] = useState(1);
    const [numOfPeople, setNumOfPeople] = useState(1);
    const [location, setLocation] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [hideResults, setHideResults] = useState(false);
    const timerRef = useRef(null);
    // console.log(numOfRoom, numOfPeople, location);

    const handleLocationChange = (text) => {
        clearTimeout(timerRef.current); // Clear the previous timer

        setLocation(text);

        timerRef.current = setTimeout(async () => {
            const suggestions = await fetchAutoComplete(text);
            setSuggestions(suggestions);
            console.log(suggestions);
        }, 2000);
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
                        <Text style={styles.dateInputLabel}>Check-in Date</Text>
                        <DatePicker
                            defaultDate={startDate}
                            onDateChange={(value) => {
                                setStartDate(value);
                                const newMinEndDate = new Date(value);
                                newMinEndDate.setDate(
                                    newMinEndDate.getDate() + 1
                                );
                                setEndDate(newMinEndDate);
                                setFormatStartDate(
                                    format(new Date(startDate), "yyyy-MM-dd")
                                );
                            }}
                            minimumDate={currentDate}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.dateInputLabel}>
                            Check-out Date
                        </Text>
                        <DatePicker
                            defaultDate={endDate}
                            onDateChange={(value) => setEndDate(value)}
                            minimumDate={minEndDate}
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
                            Number of Peoples
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
                                value={location?.name || location}
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
                                                setLocation(item);
                                                setHideResults(true);
                                            }}
                                        >
                                            <Text style={styles.itemText}>
                                                {item.name}
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
                        <Text style={styles.bookingButtonText}>Search</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}
