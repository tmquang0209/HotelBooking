import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    TouchableWithoutFeedback,
    TextInput,
    Alert,
} from "react-native";
import styles from "../styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import bcrypt from "react-native-bcrypt";
import axios from "axios";

export default function ChangePassword({ navigation }) {
    const [account, setAccount] = useState();
    const [oldPw, setOldPw] = useState();
    const [newPw, setNewPw] = useState();
    const [reNewPw, setReNewPw] = useState();

    const fetchAccount = async () => {
        const accountData = await AsyncStorage.getItem("Account");
        if (accountData) {
            const parsedAccount = JSON.parse(accountData);
            setAccount(parsedAccount);
        }
    };

    const onChangePasswordPress = async () => {
        const checkOldPw = bcrypt.compareSync(oldPw, account.password);

        if (!checkOldPw) {
            Alert.alert("Message", "Old password is incorrect!");
        } else if (newPw !== reNewPw) {
            Alert.alert(
                "Message",
                "New password and re-new password are not same!"
            );
        } else {
            const hashNewPw = bcrypt.hashSync(newPw, 1);
            setAccount((prevAccount) => ({
                ...prevAccount,
                password: hashNewPw,
            }));

            const options = {
                method: "POST",
                url: "https://api.toluu.site/post/account.php?changePassword",
                data: { email: account.email, password: hashNewPw },
            };

            try {
                const response = await axios.request(options);
                const responseData = response.data;
                const title = responseData.msgCode === 1 ? "Success" : "Error";
                Alert.alert(title, "Password changed successfully!");
                AsyncStorage.setItem("Account", JSON.stringify(account));
            } catch (err) {
                console.error(err);
            }
        }
    };

    useEffect(() => {
        navigation.setOptions({
            title: "Change Password",
        });
        fetchAccount();
    }, []);
    return (
        <TouchableWithoutFeedback>
            <SafeAreaView style={styles.container}>
                <View style={styles.inputContainer}>
                    <Text style={styles.peopleInputLabel}>Old password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Old password"
                        onChangeText={(val) => setOldPw(val)}
                        secureTextEntry
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.peopleInputLabel}>New password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="New password"
                        onChangeText={(val) => setNewPw(val)}
                        secureTextEntry
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.peopleInputLabel}>Re-new password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Re-new password"
                        onChangeText={(val) => setReNewPw(val)}
                        secureTextEntry
                    />
                </View>
                <View>
                    <TouchableOpacity
                        style={styles.bookingButton}
                        onPress={() => onChangePasswordPress()}
                    >
                        <Text style={styles.bookingButtonText}>
                            Change password
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}
