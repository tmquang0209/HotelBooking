import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
    TextInput,
    Alert,
    SafeAreaView,
} from "react-native";
import styles from "../styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DatePicker from "react-native-date-ranges";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

export default function ManageAccount() {
    const navigation = useNavigation();
    const [account, setAccount] = useState({ full_name: "", birthday: "" });

    const getAccount = async () => {
        const data = await AsyncStorage.getItem("Account");
        if (data) {
            const dataJson = JSON.parse(data);
            setAccount(dataJson);
        }
    };

    useEffect(() => {
        getAccount();
        navigation.setOptions({
            title: "Manage your account",
        });
    }, []);

    const handleSubmitPress = async () => {
        const options = {
            method: "POST",
            url: "https://api.toluu.site/post/account.php?update",
            data: account,
        };

        try {
            const response = await axios.request(options);
            const responseData = response.data;
            const title = responseData.msgCode === 1 ? "Success" : "Error";
            Alert.alert(title, responseData.message);
            AsyncStorage.setItem("Account", JSON.stringify(account));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <SafeAreaView style={styles.container}>
                <View style={styles.inputContainer}>
                    <Text style={styles.peopleInputLabel}>Full name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Full name"
                        value={account.full_name}
                        onChangeText={(val) =>
                            setAccount({ ...account, full_name: val })
                        }
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.peopleInputLabel}>Birthday</Text>
                    <DatePicker
                        style={styles.loginFormTextInput} // default width will be equal to placeholder text width
                        customStyles={{
                            placeholderText: { fontSize: 12, color: "black" }, // placeHolder style
                        }} // optional
                        placeholder={account.birthday}
                        selectedBgColor="#3897f1"
                        selectedTextColor="white"
                        calendarBgColor="#3897f1"
                        blockAfter={true}
                        onConfirm={(cur) => {
                            console.log(cur);
                            // Update the account state with the selected birthday
                            setAccount({
                                ...account,
                                birthday: cur.currentDate,
                            });
                        }}
                        outFormat="DD-MM-YYYY"
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.peopleInputLabel}>Mobile number</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Mobile number"
                        value={account.mobile_number}
                        onChangeText={(val) =>
                            setAccount({ ...account, mobile_number: val })
                        }
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.peopleInputLabel}>Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={account.email}
                        onChangeText={(val) => console.log(val)}
                        editable={false}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.peopleInputLabel}>Address</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Address"
                        value={account.address}
                        onChangeText={(val) =>
                            setAccount({ ...account, address: val })
                        }
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.peopleInputLabel}>City</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="City"
                        value={account.city}
                        onChangeText={(val) =>
                            setAccount({ ...account, city: val })
                        }
                    />
                </View>

                <TouchableOpacity
                    style={styles.bookingButton}
                    onPress={() => handleSubmitPress()}
                >
                    <Text style={styles.bookingButtonText}>Edit</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}
