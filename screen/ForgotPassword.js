import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
    TextInput,
    ActivityIndicator,
    Alert,
} from "react-native";
import styles from "../styles";
import axios from "axios";
import bcrypt from "react-native-bcrypt";
import isaac from "isaac";

export default function ForgotPassword({ navigation }) {
    const [email, setEmail] = useState();
    const [yourCode, setYourCode] = useState();
    const [code, setCode] = useState();
    const [password, setPassword] = useState();
    const [rePassword, setRePassword] = useState();
    const [show, setShow] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        navigation.setOptions({
            title: "Forgot Password",
        });
    }, []);

    const handlePressSubmit = async () => {
        const options = {
            method: "POST",
            url: "https://api.toluu.site/post/account.php?forgotPassword",
            data: {
                email,
            },
        };

        try {
            setShow(true);
            const response = await axios.request(options);
            const responseData = response.data;
            setShow(false);
            setSuccess(true);
            setYourCode(responseData.code);
            Alert.alert("Message", responseData.message);

            console.log(responseData);
        } catch (err) {
            console.error(err);
        }
    };
    console.log(typeof Number(code), typeof yourCode);
    const handlePressSubmitCode = async () => {
        if (yourCode !== Number(code)) {
            Alert.alert(
                "Message",
                "Authentication code is incorrect. Please try again."
            );
            return;
        }

        if (password !== rePassword) {
            Alert.alert(
                "Message",
                "Password and re-password are not the same. Please try again."
            );
            return;
        }

        // Use a cryptographically secure random number generator
        bcrypt.setRandomFallback((len) => {
            const buf = new Uint8Array(len);
            // Use a secure random generator from the crypto module in Node.js
            return buf.map(() => Math.floor(isaac.random() * 256));
        });

        const saltRounds = 12;

        bcrypt.hash(password, saltRounds, async (err, hash) => {
            if (err) {
                console.error(err);
                return;
            }
            const options = {
                method: "POST",
                url: "https://api.toluu.site/post/account.php?changePassword",
                data: {
                    email,
                    password: hash,
                },
            };

            try {
                setShow(true);
                const response = await axios.request(options);
                const responseData = response.data;
                setShow(false);
                Alert.alert("Message", responseData.message);
            } catch (err) {
                console.error(err);
            }
        });
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.loginScreenContainer}>
                <View style={styles.loginFormView}>
                    <ActivityIndicator size={"large"} animating={show} />
                    <Text style={styles.logoText}>Booking</Text>
                    {!success ? (
                        <View>
                            <TextInput
                                placeholder="Email"
                                placeholderColor="#c4c3cb"
                                style={styles.loginFormTextInput}
                                onChangeText={(val) => setEmail(val)}
                            />
                            <View>
                                <TouchableOpacity
                                    disabled={show}
                                    style={styles.loginButton}
                                    onPress={() => handlePressSubmit()}
                                >
                                    <Text style={styles.loginText}>
                                        Send code
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <View>
                            <TextInput
                                placeholder="Email"
                                placeholderColor="#c4c3cb"
                                style={styles.loginFormTextInput}
                                onChangeText={(val) => setEmail(val)}
                                selectTextOnFocus={false}
                                editable={false}
                            />
                            <TextInput
                                placeholder="Code"
                                placeholderColor="#c4c3cb"
                                style={styles.loginFormTextInput}
                                onChangeText={(val) => setCode(val)}
                                keyboardType="numeric"
                            />
                            <TextInput
                                placeholder="Password"
                                placeholderColor="#c4c3cb"
                                style={styles.loginFormTextInput}
                                onChangeText={(val) => setPassword(val)}
                                secureTextEntry={true}
                            />
                            <TextInput
                                placeholder="Re-password"
                                placeholderColor="#c4c3cb"
                                style={styles.loginFormTextInput}
                                onChangeText={(val) => setRePassword(val)}
                                secureTextEntry={true}
                            />
                            <View>
                                <TouchableOpacity
                                    disabled={show}
                                    style={styles.loginButton}
                                    onPress={() => handlePressSubmitCode()}
                                >
                                    <Text style={styles.loginText}>
                                        Change Password
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}
