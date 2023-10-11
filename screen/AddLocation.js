import React, { useEffect, useState } from "react";
import styles from "../styles";
import {
    View,
    Text,
    Alert,
    Keyboard,
    TextInput,
    SafeAreaView,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from "react-native";
import axios from "axios";

export default function AddLocation({ navigation }) {
    const [detail, setDetail] = useState({});

    const handleSubmitPress = async () => {
        const options = {
            method: "POST",
            url: "https://api.toluu.site/post/auto-complete.php?add",
            data: {
                detail,
            },
        };

        try {
            const response = await axios.request(options);
            Alert.alert("Message", "Add success");
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        navigation.setOptions({
            title: "Add Location",
        });
    }, []);

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <SafeAreaView style={styles.container}>
                <View style={styles.inputContainer}>
                    <Text>City name:</Text>
                    <TextInput
                        style={styles.input}
                        value={detail?.city_name}
                        onChangeText={(val) =>
                            setDetail({ ...detail, city_name: val })
                        }
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text>Label:</Text>
                    <TextInput
                        style={styles.input}
                        value={detail?.label}
                        onChangeText={(val) =>
                            setDetail({ ...detail, label: val })
                        }
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text>Timezone:</Text>
                    <TextInput
                        style={styles.input}
                        value={detail?.timezone}
                        onChangeText={(val) =>
                            setDetail({ ...detail, timezone: val })
                        }
                    />
                </View>
                <TouchableOpacity
                    style={styles.bookingButton}
                    onPress={() => handleSubmitPress()}
                >
                    <Text style={styles.bookingButtonText}>Add</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}
