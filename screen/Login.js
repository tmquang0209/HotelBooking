import React, { useState } from "react";
import {
    Alert,
    Keyboard,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
    TouchableOpacity,
} from "react-native";
import styles from "../styles";
import axios from "axios";
import bcrypt from "react-native-bcrypt";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const handlePressLogin = async (username, password, navigation) => {
    if (!username || !password) {
        Alert.alert("Error", "Please complete all information.");
        return;
    }

    const options = {
        method: "POST",
        url: "https://api.toluu.site/post/account.php?check",
        data: {
            username,
        },
    };

    try {
        const response = await axios.request(options);
        const responseJson = JSON.parse(response.data.info);

        if (!responseJson) {
            Alert.alert("Error", "Account doesn't exist.");
            return;
        }

        const checkPassword = bcrypt.compareSync(
            password,
            responseJson.password
        );

        if (checkPassword) {
            await AsyncStorage.setItem("Account", JSON.stringify(responseJson));
            await AsyncStorage.setItem("isLoggedIn", "true");
            navigation.navigate("Dashboard");
            // Alert.alert("Success", "Login success");
        } else {
            Alert.alert("Error", "Password is incorrect.");
        }
    } catch (err) {
        console.error(err);
    }
};

export default function Login() {
    const navigation = useNavigation();
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();

    const onLoginPress = () => {
        handlePressLogin(username, password, navigation);
    };

    const onForgotPasswordPress = () => {
        navigation.navigate("ForgotPassword");
    };

    const onSignUpPress = () => {
        navigation.navigate("Signup");
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.loginScreenContainer}>
                <View style={styles.loginFormView}>
                    <Text style={styles.logoText}>Booking</Text>
                    <TextInput
                        placeholder="Email"
                        placeholderColor="#c4c3cb"
                        style={styles.loginFormTextInput}
                        onChangeText={(val) => setUsername(val)}
                    />
                    <TextInput
                        placeholder="Password"
                        placeholderColor="#c4c3cb"
                        style={styles.loginFormTextInput}
                        secureTextEntry={true}
                        onChangeText={(val) => setPassword(val)}
                    />
                    <TouchableOpacity
                        style={styles.forgotBtn}
                        onPress={() => onForgotPasswordPress()}
                    >
                        <Text style={styles.forgotTxt}>Forgot Password?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={() => onLoginPress()}
                    >
                        <Text style={styles.loginText}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.signupButton}
                        onPress={() => onSignUpPress()}
                    >
                        <Text style={styles.signupText}>Signup now</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}
