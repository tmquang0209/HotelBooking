import React, { useEffect, useState } from "react";
import styles from "../styles";
import {
    View,
    Text,
    Alert,
    SafeAreaView,
    TextInput,
    TouchableOpacity,
} from "react-native";
import axios from "axios";
import DatePicker from "react-native-date-ranges";
import SelectDropdown from "react-native-select-dropdown";

export default function UserDetail({ navigation, route }) {
    const [item, setItem] = useState(route.params.item);
    const role = ["customer", "admin"];

    const handleSubmitPress = async () => {
        const options = {
            method: "POST",
            url: "https://api.toluu.site/post/account.php?update",
            data: item,
        };

        try {
            const response = await axios.request(options);
            const responseData = response.data;
            console.log(responseData);
            const title = responseData.msgCode === 1 ? "Success" : "Error";
            Alert.alert(title, responseData.message);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        navigation.setOptions({
            title: "Update Info",
        });
    }, []);
    console.log(item);
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.inputContainer}>
                <Text>Full name:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Full name"
                    onChangeText={(val) => {
                        setItem({ ...item, full_name: val });
                    }}
                    value={item.full_name}
                />
            </View>
            <View style={styles.inputContainer}>
                <Text>Birthday:</Text>
                <DatePicker
                    style={styles.loginFormTextInput} // default width will be equal to placeholder text width
                    customStyles={{
                        placeholderText: { fontSize: 12, color: "black" }, // placeHolder style
                    }} // optional
                    placeholder={item.birthday}
                    selectedBgColor="#3897f1"
                    selectedTextColor="white"
                    calendarBgColor="#3897f1"
                    blockAfter={true}
                    onConfirm={(cur) => {
                        console.log(cur);
                        // Update the account state with the selected birthday
                        setItem({
                            ...item,
                            birthday: cur.currentDate,
                        });
                    }}
                    outFormat="DD-MM-YYYY"
                />
            </View>
            <View style={styles.inputContainer}>
                <Text>Email:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    // onChangeText={(val) => {
                    //     setItem({ ...item, full_name: val });
                    // }}
                    aria-disabled
                    editable={false}
                    value={item.email}
                />
            </View>
            <View style={styles.inputContainer}>
                <Text>Mobile phone:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Mobile phone"
                    onChangeText={(val) => {
                        setItem({ ...item, mobile_number: val });
                    }}
                    value={item.mobile_number}
                    keyboardType="numeric"
                />
            </View>
            <View style={styles.inputContainer}>
                <Text>Role:</Text>
                <SelectDropdown
                    data={role}
                    onSelect={(selectedItem, index) => {
                        setItem({
                            ...item,
                            type: selectedItem,
                        });
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                        // text represented after item is selected
                        // if data array is an array of objects then return selectedItem.property to render after item is selected
                        return selectedItem;
                    }}
                    rowTextForSelection={(item, index) => {
                        // text represented for each item in dropdown
                        // if data array is an array of objects then return item.property to represent item in dropdown
                        return item;
                    }}
                    buttonStyle={{ width: "100%" }}
                    defaultValue={item.type}
                    defaultValueByIndex={role.findIndex(
                        (it) => it === item.type
                    )}
                />
            </View>
            <TouchableOpacity
                style={styles.bookingButton}
                onPress={() => handleSubmitPress()}
            >
                <Text style={styles.bookingButtonText}>Update</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
