import React, { useState } from "react";
import {
    Alert,
    Keyboard,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
    TouchableOpacity,
    AsyncStorage,
} from "react-native";
import styles from "../styles";
import axios from "axios";
import bcrypt from "react-native-bcrypt";
import isaac from "isaac";
import { useNavigation } from "@react-navigation/native";
import DatePicker from "react-native-date-ranges";
import { format } from "date-fns";

const handlePressSignup = async (
    fullName,
    birthday,
    email,
    mobileNumber,
    password,
    address,
    city,
    navigation
) => {
    const saltRounds = 12;
    // Use a cryptographically secure random number generator
    bcrypt.setRandomFallback((len) => {
        const buf = new Uint8Array(len);
        // Use a secure random generator from the crypto module in Node.js
        return buf.map(() => Math.floor(isaac.random() * 256));
    });
    
    bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
            console.error(err);
            return;
        }

        const options = {
            method: "POST",
            url: "https://api.toluu.site/post/account.php?signup",
            data: {
                fullName,
                birthday,
                email,
                mobileNumber,
                password: hash,
                address,
                city,
            },
        };

        try {
            const response = await axios.request(options);
            const responseJson = response.data;
            if (responseJson) {
                Alert.alert(responseJson.title, responseJson.message);
                if (responseJson.msgCode === 1) navigation.navigate("Login");
            }
        } catch (err) {
            console.error(err);
        }
    });
};

export default function Signup() {
    const navigation = useNavigation();
    const [fullName, setFullName] = useState();
    const [birthday, setBirthday] = useState(format(new Date(), "dd-mm-Y"));
    const [email, setEmail] = useState();
    const [mobileNumber, setMobileNumber] = useState();
    const [password, setPassword] = useState();
    const [rePassword, setRePassword] = useState();
    const [address, setAddress] = useState();
    const [city, setCity] = useState();

    const onSignupPress = () => {
        if (
            fullName &&
            birthday &&
            email &&
            mobileNumber &&
            password &&
            address &&
            city
        )
            if (password === rePassword)
                handlePressSignup(
                    fullName,
                    birthday,
                    email,
                    mobileNumber,
                    password,
                    address,
                    city,
                    navigation
                );
            else Alert.alert("Error", "Password is incorrect.");
        else Alert.alert("Error", "Please complete all information.");
    };

    const onLoginPress = () => {
        navigation.navigate("Login");
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.loginScreenContainer}>
                <View style={styles.loginFormView}>
                    <Text style={styles.logoText}>Booking</Text>
                    <TextInput
                        placeholder="Full name"
                        placeholderColor="#c4c3cb"
                        style={styles.loginFormTextInput}
                        onChangeText={(val) => setFullName(val)}
                    />

                    <DatePicker
                        style={styles.loginFormTextInput} // default width will be equal to placeholder text width
                        customStyles={{
                            placeholderText: { fontSize: 15, color: "black" }, // placeHolder style
                        }} // optional
                        placeholder={birthday}
                        selectedBgColor="#3897f1"
                        selectedTextColor="white"
                        calendarBgColor="#3897f1"
                        onConfirm={(cur) => {
                            setBirthday(cur.currentDate);
                            console.log(cur.currentDate);
                        }}
                    />

                    <TextInput
                        placeholder="Email"
                        placeholderColor="#c4c3cb"
                        style={styles.loginFormTextInput}
                        onChangeText={(val) => setEmail(val)}
                    />

                    <TextInput
                        placeholder="Mobile number"
                        placeholderColor="#c4c3cb"
                        style={styles.loginFormTextInput}
                        onChangeText={(val) => setMobileNumber(val)}
                        keyboardType="numeric"
                    />

                    <TextInput
                        placeholder="Password"
                        placeholderColor="#c4c3cb"
                        style={styles.loginFormTextInput}
                        secureTextEntry={true}
                        onChangeText={(val) => setPassword(val)}
                    />

                    <TextInput
                        placeholder="Re-Password"
                        placeholderColor="#c4c3cb"
                        style={styles.loginFormTextInput}
                        secureTextEntry={true}
                        onChangeText={(val) => setRePassword(val)}
                    />

                    <TextInput
                        placeholder="Address"
                        placeholderColor="#c4c3cb"
                        style={styles.loginFormTextInput}
                        onChangeText={(val) => setAddress(val)}
                    />

                    <TextInput
                        placeholder="City"
                        placeholderColor="#c4c3cb"
                        style={styles.loginFormTextInput}
                        onChangeText={(val) => setCity(val)}
                    />

                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={() => onSignupPress()}
                    >
                        <Text style={styles.loginText}>Signup</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.signupButton}
                        onPress={() => onLoginPress()}
                    >
                        <Text style={styles.signupText}>Back to login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}
